import React, { useState } from "react";
import api from "../api"; // axios instance

function BookCard({ book, showSave = false, onDelete = null }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post("/api/books/", {
        title: book.title,
        author: book.author || "Unknown",
        isbn: book.isbn || null,
        cover_url: book.cover_url || null,
        description: book.description || "",
        published_date: book.published_date || null,
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save book:", err);
      alert("Error saving book. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      setDeleting(true);
      await api.delete(`/api/books/${book.id}/`);
      onDelete(book.id); // notify parent (MyBooksPage) to remove from list
    } catch (err) {
      console.error("Failed to delete book:", err);
      alert("Error deleting book. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center w-64">
      {book.cover_url ? (
        <img
          src={book.cover_url}
          alt={book.title}
          className="w-32 h-48 object-cover rounded mb-2"
        />
      ) : (
        <div className="w-32 h-48 bg-gray-200 flex items-center justify-center mb-2">
          <span className="text-gray-500">No Image</span>
        </div>
      )}

      <h3 className="text-lg font-semibold text-center">{book.title}</h3>
      <p className="text-sm text-gray-600 text-center">
        {book.author || "Unknown Author"}
      </p>

      {/* Description with toggle */}
      {book.description && (
        <div className="mt-2 text-sm text-gray-700 w-full">
          <p className={expanded ? "" : "line-clamp-3"}>
            {book.description}
          </p>
          {book.description.length > 120 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 text-xs mt-1 hover:underline"
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>
      )}

      {/* Save button (only in SearchBooksPage) */}
      {showSave && (
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`mt-2 px-3 py-1 rounded ${
            saved
              ? "bg-green-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {saved ? "Saved" : saving ? "Saving..." : "Save"}
        </button>
      )}

      {/* Delete button (only in MyBooksPage) */}
      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="mt-2 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      )}
    </div>
  );
}

export default BookCard;
