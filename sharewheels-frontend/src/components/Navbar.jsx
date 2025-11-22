import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, toggleTheme } = useTheme();

  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 
        bg-slate-900/90 backdrop-blur-md 
        border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity"
          style={{ color: "rgb(var(--fg))" }}
        >
          ShareWheels
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium">

          {isLoggedIn && (
            <Link
              to="/dashboard"
              className={`${isActive('/dashboard') ? 'text-brand-purple' : 'hover:text-[rgb(var(--fg))]'} transition-colors`}
              style={{ color: "rgb(var(--fg))" }}
            >
              Dashboard
            </Link>
          )}
        </div>

        
        <div className="flex items-center gap-4">

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === "light" ? (
              <Moon size={18} className="text-[rgb(var(--fg))]" />
            ) : (
              <Sun size={18} className="text-[rgb(var(--fg))]" />
            )}
          </button>

          
          {isLoggedIn ? (
            <>
              <span className="hidden sm:block text-sm opacity-80" style={{ color: "rgb(var(--fg))" }}>
                Hi, {username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-400 transition-colors"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium opacity-80 hover:opacity-100 transition-colors"
                style={{ color: "rgb(var(--fg))" }}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-all dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
