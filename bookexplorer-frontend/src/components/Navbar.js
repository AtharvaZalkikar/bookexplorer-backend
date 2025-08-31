// src/components/Navbar.js
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import { getToken, clearToken } from '../auth';

function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));
  const [username, setUsername]     = useState('');

  // Re-compute login state whenever our custom 'auth' event fires
  useEffect(() => {
    const onAuth = () => {
      const hasToken = Boolean(getToken());
      setIsLoggedIn(hasToken);
      if (hasToken) {
        // fetch current user
        api.get('api/user/')
          .then(res => setUsername(res.data.username))
          .catch(() => setUsername(''));
      } else {
        setUsername('');
      }
    };

    // run once on mount
    onAuth();

    // subscribe to auth changes
    window.addEventListener('auth', onAuth);
    return () => window.removeEventListener('auth', onAuth);
  }, []);

  const navLinkClass = (path) =>
    `hover:text-blue-300 ${location.pathname === path ? 'text-blue-400 underline' : ''}`;

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 px-6 py-4 text-white shadow">
      <ul className="flex items-center gap-6 text-lg font-medium w-full">
        <li><Link to="/" className={navLinkClass('/')}>Home</Link></li>
        <li><Link to="/search" className={navLinkClass('/search')}>Search Books</Link></li>

        {isLoggedIn && (
          <>
            <li><Link to="/add-book" className={navLinkClass('/add-book')}>Add Book</Link></li>
            <li><Link to="/my-books" className={navLinkClass('/my-books')}>My Books</Link></li>
          </>
        )}

        <li className="ml-auto flex items-center gap-4">
          {isLoggedIn && (
            <span className="text-sm opacity-80">Welcome, {username || '…'}</span>
          )}
          {!isLoggedIn ? (
            <>
            <Link
              to="/login"
              className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-white"
            >
              Login
            </Link>
            <Link
                to="/signup"
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 text-white"
              >
                Sign Up
              </Link></>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
            >
              Logout
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
