// MyBooksPage.jsx
import { useState, useEffect } from "react";
import api from "../api";
import BookCard from "../components/BookCard";

export default function MyBooksPage() {
  const [books, setBooks] = useState([]);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async (url = "api/books/") => {
    try {
      setLoading(true);
      const res = await api.get(url);
      setBooks(res.data.results || []);
      setNext(res.data.next);
      setPrev(res.data.previous);
    } catch (err) {
      console.error("Failed to load books", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`api/books/${id}/`);
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Failed to delete book", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">My Books</h1>

      {loading ? (
        <p className="text-gray-500">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-500">No books added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-6">
        {prev && (
          <button
            onClick={() => fetchBooks(prev)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </button>
        )}
        {next && (
          <button
            onClick={() => fetchBooks(next)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
