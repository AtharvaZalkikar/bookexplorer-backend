from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, FetchBookByISBN, FetchAndSaveBookView, SearchOpenLibraryView, SaveBookFromSearchView

router = DefaultRouter()
router.register(r'books', BookViewSet)

urlpatterns = [
    path('', include(router.urls)), 
    path('fetch-book/', FetchBookByISBN.as_view(), name='fetch-book'),
    path('fetch-and-save/',FetchAndSaveBookView.as_view(),name='fetch-and-save'),
    path('search-open/', SearchOpenLibraryView.as_view(), name='search-open'),
    path('save-from-search/', SaveBookFromSearchView.as_view(), name='save-from-search'),
]