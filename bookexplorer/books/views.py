from django.shortcuts import render
import requests
from rest_framework import viewsets, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Book
from .serializers import BookSerializer
from .utils import fetch_book_data_from_isbn

# =============================================
# 📚 BookViewSet - Handles listing, filtering, editing books
# =============================================
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-created_at')
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Enable filtering, searching, ordering
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['published_date']
    search_fields = ['title', 'author']
    ordering_fields = ['published_date', 'title']

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'detail': 'Only admin can delete books.'},
                            status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)


# =============================================
# 🔍 FetchBookByISBN - Fetches book data using ISBN (from Open Library)
# =============================================
class FetchBookByISBN(APIView):
    def get(self, request):
        isbn = request.query_params.get('isbn')
        if not isbn:
            return Response({'error': 'ISBN is required'}, status=status.HTTP_400_BAD_REQUEST)

        book_data = fetch_book_data_from_isbn(isbn)
        if book_data:
            return Response(book_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Book not Found'}, status=status.HTTP_404_NOT_FOUND)


# =============================================
# 💾 FetchAndSaveBookView - Fetches book via ISBN and saves to DB
# =============================================
class FetchAndSaveBookView(APIView):
    def post(self, request):
        isbn = request.data.get('isbn')
        if not isbn:
            return Response({'error': 'ISBN is required'}, status=status.HTTP_400_BAD_REQUEST)

        if Book.objects.filter(isbn=isbn).exists():
            return Response({"error": "Book with this ISBN already exists."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            book_data = fetch_book_data_from_isbn(isbn)
            book_data['isbn'] = isbn  # Ensure it's preserved
        except ValueError as ve:
            if "not found" in str(ve).lower():
                return Response({"error": str(ve)}, status=status.HTTP_404_NOT_FOUND)
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except requests.exceptions.RequestException:
            return Response({"error": "Failed to fetch from Open Library"}, status=status.HTTP_502_BAD_GATEWAY)

        serializer = BookSerializer(data=book_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =============================================
# 🔎 SearchOpenLibraryView - Search by title (returns top 15 results)
# =============================================
class SearchOpenLibraryView(APIView):
    def get(self, request):
        title = request.query_params.get('title')
        if not title:
            return Response({"error": "Title query param is required."}, status=status.HTTP_400_BAD_REQUEST)

        url = f"https://openlibrary.org/search.json?title={title}"
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
        except requests.exceptions.RequestException:
            return Response({"error": "Failed to fetch from Open Library"}, status=status.HTTP_502_BAD_GATEWAY)

        data = response.json()
        results = []

        for doc in data.get('docs', [])[:15]:
            title = doc.get("title")
            author = ", ".join(doc.get("author_name", [])) if doc.get("author_name") else "Unknown"
            published_year = doc.get("first_publish_year", "Unknown")
            isbn_list = doc.get("isbn", [])
            isbn = isbn_list[0] if isbn_list else None

            # Cover Image from OLID fallback
            cover_id = doc.get("cover_edition_key") or (doc.get("edition_key") or [None])[0]
            cover_url = f"https://covers.openlibrary.org/b/olid/{cover_id}-L.jpg" if cover_id else None

            results.append({
                "title": title,
                "author": author,
                "published_year": published_year,
                "isbn": isbn,
                "cover_url": cover_url
            })

        return Response(results)


# =============================================
# 📝 SaveBookFromSearchView - Saves book returned from search manually
# =============================================
class SaveBookFromSearchView(APIView):
    def post(self, request):
        data = request.data
        title = data.get('title')
        author = data.get('author')
        isbn = data.get('isbn')

        if not title or not author:
            return Response({"error": "Title and author are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Duplicate check by ISBN or (title + author)
        if isbn and Book.objects.filter(isbn=isbn).exists():
            return Response({"error": "Book with this ISBN already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if not isbn and Book.objects.filter(title=title, author=author).exists():
            return Response({"error": "Book with this title and author already exists."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = BookSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
