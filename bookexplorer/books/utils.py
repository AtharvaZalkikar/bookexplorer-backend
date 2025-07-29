# books/utils.py

import requests

# ==============================================================
# 🔍 Function to Fetch Book Metadata from Open Library by ISBN
# ==============================================================

def fetch_book_data_from_isbn(isbn):
    """
    Fetches book details using Open Library ISBN API.
    Raises ValueError if the book is not found.
    """
    url = f"https://openlibrary.org/isbn/{isbn}.json"

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        # Extract core fields
        title = data.get('title', '')
        publish_date = data.get('publish_date', '')
        authors_data = data.get('authors', [])
        description = data.get('description', '')

        # Description could be a dict or string
        if isinstance(description, dict):
            description = description.get('value', '')

        # 🧠 Fetch author names using author keys
        authors = []
        for author in authors_data:
            author_key = author.get('key')  # e.g. "/authors/OL123A"
            if author_key:
                author_resp = requests.get(f"https://openlibrary.org{author_key}.json")
                if author_resp.status_code == 200:
                    author_json = author_resp.json()
                    authors.append(author_json.get('name'))

        return {
            "title": title,
            "author": ', '.join(authors) if authors else 'Unknown',
            "published_date": publish_date,
            "description": description,
            "cover_url": f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg",  # Large cover
        }

    except requests.exceptions.HTTPError as http_err:
        raise ValueError(f"Book not found or invalid ISBN: {isbn}") from http_err
    except requests.exceptions.RequestException as req_err:
        raise req_err
