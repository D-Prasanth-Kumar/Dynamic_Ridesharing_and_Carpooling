import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/verify-otp', null, {
        params: { email, otp }
      });

      navigate('/login');

    } catch (err) {
      setError(err.response?.data || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] flex flex-col transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center relative px-6">

  
        <div className="relative w-full max-w-md bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-8 shadow-xl backdrop-blur-xl transition-colors">

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full text-emerald-500 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[rgb(var(--color-txt-main))]">Verify your email</h2>
            <p className="text-[rgb(var(--color-txt-dim))] text-sm mt-2">
              Code sent to <span className="font-medium text-[rgb(var(--color-txt-main))]">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-[rgb(var(--color-txt-main))] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[rgb(var(--color-txt-main))] text-[rgb(var(--color-page))] font-semibold py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Verify Account"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
