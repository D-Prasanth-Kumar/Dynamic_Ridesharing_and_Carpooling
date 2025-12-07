import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Sun, Moon, Bell, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); 
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      const data = res.data || [];
      setNotifications(data);
      const unread = data.filter(n => n.isRead === false).length;
      setUnreadCount(unread);
    } catch (err) {
      console.log("Notification fetch skipped");
    }
  };

  const handleToggleNotifications = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);

    if (newState && unreadCount > 0) {
      setUnreadCount(0);
      
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      
      unreadIds.forEach(async (id) => {
        try {
          await api.put(`/notifications/${id}/read`);
        } catch(e) { /* ignore error */ }
      });

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-800 text-white shadow-lg border-b border-indigo-700">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

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

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-indigo-700 transition"
          >
            {theme === "light" ? (
              <Moon size={18} className="text-[rgb(var(--fg))]" />
            ) : (
              <Sun size={18} className="text-[rgb(var(--fg))]" />
            )}
          </button>

          {isLoggedIn ? (
            <>
              <div className="relative">
                <button 
                  onClick={handleToggleNotifications} 
                  className="p-2 rounded-full hover:bg-indigo-700 transition relative"
                >
                  <Bell size={20} className="text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-300 rounded-full border border-indigo-900 animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white text-indigo-900 rounded-xl shadow-2xl border border-indigo-200 overflow-hidden">
                    <div className="p-3 border-b border-indigo-200 bg-indigo-50 flex justify-between items-center">
                      <h3 className="font-semibold text-sm text-indigo-800">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)} className="hover:text-indigo-600"><X size={16} /></button>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">No notifications yet.</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-4 border-b border-indigo-100 hover:bg-indigo-50 transition text-sm ${!n.isRead ? 'bg-indigo-50' : ''}`}>
                            <p className="mb-1">{n.message}</p>
                            <p className="text-xs text-indigo-400">
                              {n.timestamp ? new Date(n.timestamp).toLocaleString().replace(",", " -") : "Just now"}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <span className="hidden sm:block text-sm text-indigo-100" style={{ color: "rgb(var(--fg))" }}>
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
            <div className="flex items-center gap-4">
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
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}