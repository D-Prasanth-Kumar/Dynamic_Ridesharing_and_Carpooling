import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { User, Car, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('PASSENGER');
  const[isLoading, setIsLoading] = useState(false);
  const[error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post("/auth/register", { ...formData, role });
      navigate("/verify-otp", { state: { email: formData.email } });

    } catch(err){
      console.error(err);
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] flex flex-col transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center relative px-6 py-20">

        
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-brand-blue/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        
        <div className="relative w-full max-w-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-8 shadow-xl backdrop-blur-xl transition-colors">

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[rgb(var(--color-txt-main))]">Create an account</h2>
            <p className="text-[rgb(var(--color-txt-dim))] text-sm mt-2">Join ShareWheels today</p>
          </div>

         
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-3 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          
          <div className="mb-6">
            <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-2">
              Select Role
            </label>

            <div className="relative w-full bg-white/10 border border-gray-300/30 rounded-xl p-1 flex items-center">

              
              <div
                className={`absolute top-1 bottom-1 w-1/2 rounded-lg transition-all duration-300 ${
                  role === "DRIVER"
                    ? "translate-x-full"
                    : "translate-x-0"
                }`}
                style={{
                  backgroundColor: role === "DRIVER" ? "#2563eb20" : "#7c3aed20",
                  boxShadow: `0 0 8px ${
                    role === "DRIVER" ? "#2563eb40" : "#7c3aed40"
                  }`,
                }}
              />

              
              <button
                type="button"
                onClick={() => setRole("PASSENGER")}
                className="relative flex-1 py-3 text-sm font-semibold rounded-lg z-10 transition-all"
                style={{
                  color: role === "PASSENGER" ? "#7c3aed" : "rgb(var(--color-txt-dim))",
                }}
              >
                Passenger
              </button>

              
              <button
                type="button"
                onClick={() => setRole("DRIVER")}
                className="relative flex-1 py-3 text-sm font-semibold rounded-lg z-10 transition-all"
                style={{
                  color: role === "DRIVER" ? "#2563eb" : "rgb(var(--color-txt-dim))",
                }}
              >
                Driver
              </button>

            </div>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">
          
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">Name</label>
                <input
                  required
                  name="name"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg px-4 py-2 text-[rgb(var(--color-txt-main))] focus:border-brand-purple/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">Username</label>
                <input
                  required
                  name="username"
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg px-4 py-2 text-[rgb(var(--color-txt-main))] focus:border-brand-purple/50 transition-all"
                />
              </div>
            </div>

          
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">Email</label>
              <input
                required
                name="email"
                type="email"
                onChange={handleChange}
                className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg px-4 py-2 text-[rgb(var(--color-txt-main))] focus:border-brand-purple/50 transition-all"
              />
            </div>

        
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">Phone</label>
              <input
                required
                name="phone"
                type="text"
                onChange={handleChange}
                className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg px-4 py-2 text-[rgb(var(--color-txt-main))] focus:border-brand-purple/50 transition-all"
              />
            </div>

         
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">Password</label>
              <input
                required
                name="password"
                type="password"
                onChange={handleChange}
                className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg px-4 py-2 text-[rgb(var(--color-txt-main))] focus:border-brand-purple/50 transition-all"
              />
            </div>

          
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[rgb(var(--color-txt-main))] text-[rgb(var(--color-page))] font-semibold py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          
          <div className="mt-6 text-center text-sm text-[rgb(var(--color-txt-dim))]">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-purple hover:text-brand-blue transition-colors">
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
