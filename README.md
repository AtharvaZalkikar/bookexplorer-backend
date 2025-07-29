\# 📚 BookExplorer API



BookExplorer is a Django REST Framework (DRF)-powered backend project that allows users to search, fetch, and save books using the Open Library API. It supports searching by title, fetching by ISBN, and prevents duplicate entries — all via clean, well-structured REST APIs.



---



\## 🚀 Features



🔍 Search books by title using Open Library's public API

📚 Fetch book details using ISBN (title, author, publish date, cover, description)

✍️ Save books to local database with duplicate prevention

🔐 Admin-only deletion of books

📑 Pagination, filtering, searching, and ordering

📦 API-first architecture for React/JS frontend consumption



---



\## 🛠 Tech Stack



Python 3.10

Django 5.1

Django REST Framework

Open Library API (external)

SQLite (dev), deploy-ready with PostgreSQL

Insomnia/Postman/React-compatible API



---



\## ⚙️ Getting Started



\### 1. Clone the repo



```bash

git clone https://github.com/AtharvaZalkikar/bookexplorer-backend.git

cd bookexplorer-backend




## 2. Create a virtual environment

python -m venv venv

\# On Windows:

venv\\Scripts\\activate

\# On Mac/Linux:

source venv/bin/activate




## 3. Install dependencies

pip install -r requirements.txt




## 4. Run migrations

python manage.py migrate




## 5. Run the development server

python manage.py runserver```






🔐 Authentication

- All GET and POST endpoints are publicly accessible.
- DELETE and PUT operations on books require authentication and are restricted to staff/admin users.
- Authentication system is DRF-ready (token-based or session-based login support).



🔗 API Endpoints



| Endpoint                 | Method      | Description                            | Auth Required  |

| ------------------------ | ----------- | -------------------------------------- | -------------  |

| `/search-open?title=...` | `GET`       | Search books from Open Library         | No             |

| `/fetch-book/?isbn=...`  | `GET`       | Fetch book details from Open Library   | No             |

| `/fetch-and-save/`       | `POST`      | Fetch from ISBN and save to DB         | No             |

| `/save-from-search/`     | `POST`      | Save book (manual or from search list) | No             |

| `/books/`                | `GET`       | List all saved books (with filters)    | No             |

| `/books/<id>/`           | `DELETE`    | Delete a book                          | ✅ Yes (Admin) |

| `/books/<id>/`           | `PUT/PATCH` | Update a book                          | ✅ Yes (Auth)  |



📌Filtering, Search, and Ordering



You can use the following query params on /books/:



?search=tolkien → matches title or author
?ordering=published\\\\\\\\\\\\\\\_date → ascending
?ordering=-title → descending by title
?published\\\\\\\\\\\\\\\_date=2001 → exact match filter



🧑‍💻 Author

Atharva Zalkikar
GitHub



📍 Roadmap

✅ Backend API completed with testing
🎨 React / Tailwind frontend integration (up next!)
🌐 Deployment to global server










