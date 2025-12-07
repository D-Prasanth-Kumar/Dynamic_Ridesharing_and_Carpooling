import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      const { token, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', formData.username);

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] flex flex-col transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center relative px-6">

        
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-brand-purple/30 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Login */}
        <div className="relative w-full max-w-md bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl z-10 transition-colors">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[rgb(var(--color-txt-main))]">Welcome back</h2>
            <p className="text-[rgb(var(--color-txt-dim))] text-sm mt-2">
              Enter your details to access your account
            </p>
          </div>

          
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg px-4 py-3 text-[rgb(var(--color-txt-main))] placeholder-[rgb(var(--color-txt-muted))]focus:outline-none focus:border-brand-purple/50 transition-all"
                placeholder="Enter your username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg px-4 py-3 text-[rgb(var(--color-txt-main))] placeholder-[rgb(var(--color-txt-muted))]focus:outline-none focus:border-brand-purple/50 transition-all"
                placeholder="Enter your password"
              />
            </div>

            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[rgb(var(--color-txt-main))] text-[rgb(var(--color-page))] font-semibold py-3 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

          </form>

          
          <div className="mt-6 text-center text-sm text-[rgb(var(--color-txt-dim))]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-brand-purple hover:text-brand-blue transition-colors"
            >
              Sign up
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
