// src/pages/SearchBooksPage.js
import React, { useState } from "react";
import { searchBooks } from "../api";
import BookCard from "../components/BookCard";

const SearchBooksPage = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await searchBooks(query);

      // ✅ DRF paginated results
      setBooks(response.data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setError("Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Trigger search when pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Books</h1>

      {/* Search box */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Enter book title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown} // ✅ Listen for Enter key
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Error / Loading */}
      {error && <p className="text-red-600">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.length > 0 ? (
          books.map((book) => (
            <BookCard
              key={book.id || book.isbn || book.key}
              book={book}
              showSave
            />
          ))
        ) : (
          !loading && <p>No results yet.</p>
        )}
      </div>
    </div>
  );
};

export default SearchBooksPage;
