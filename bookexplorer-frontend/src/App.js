// src/App.js (snippet)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchBooksPage from './pages/SearchBooksPage';
import AddBookPage from './pages/AddBookPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from "./pages/SignUpPage";
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import MyBooksPage from './pages/MyBooksPage'; // create this later

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          {/* public search */}
          <Route path="/search" element={<SearchBooksPage />} />

          {/* protected add-book and my-books */}
          <Route
            path="/add-book"
            element={
              <ProtectedRoute>
                <AddBookPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-books"
            element={
              <ProtectedRoute>
                <MyBooksPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
