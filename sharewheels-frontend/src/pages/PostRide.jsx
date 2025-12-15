import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MapPin, Calendar, Clock, Users, Loader2, AlertCircle, Navigation } from 'lucide-react';
import api from '../services/api';

export default function PostRide() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    date: '',
    time: '',
    availableSeats: '3',
    pricePerKm: '',
    stops: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let formattedTime = formData.time;
      
      if (formattedTime && formattedTime.length === 5) {
        formattedTime += ":00";
      }

      const payload = {
        ...formData,
        time: formattedTime,
        availableSeats: parseInt(formData.availableSeats, 10),
        pricePerKm: parseFloat(formData.pricePerKm) 
      };

      await api.post('/rides', payload);
      navigate('/dashboard');

    } catch (err) {
      console.error("Post Ride Error:", err);
      
      let errorMessage = "Failed to post ride.";
      if (err.response?.data?.message) errorMessage = err.response.data.message;
      else if (typeof err.response?.data === "string") errorMessage = err.response.data;

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] flex flex-col transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center relative px-6 py-20">

        
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-blue/20 to-brand-purple/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        
        <div className="relative w-full max-w-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-8 shadow-2xl backdrop-blur-xl transition-colors">

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Navigation 
                size={24}
              />
            </div>
            <h2 className="text-2xl font-bold text-[rgb(var(--color-txt-main))]">Host a Ride</h2>
            <p className="text-[rgb(var(--color-txt-dim))] text-sm mt-2">Share your journey and earn</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            
            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-[rgb(var(--color-txt-muted))]/20">
              <div>
                <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1 ml-1">
                  From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-brand-purple" size={18} />
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-12 pr-4 py-3 text-[rgb(var(--color-txt-main))] placeholder-[rgb(var(--color-txt-dim))] focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 focus:outline-none transition-all"
                    placeholder="City or Area"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1 ml-1">
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-brand-blue" size={18} />
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-12 pr-4 py-3 text-[rgb(var(--color-txt-main))] placeholder-[rgb(var(--color-txt-dim))] focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 focus:outline-none transition-all"
                    placeholder="Destination"
                  />
                </div>
              </div>

              <div>
                  <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1 mt-4">
                      Via / Stops (Optional)
                  </label>
                  <div className="relative">
                      <Navigation className="absolute left-4 top-3.5 text-orange-500" size={18} />
                      <input
                          type="text"
                          name="stops"
                          value={formData.stops}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-12 pr-4 py-3 text-[rgb(var(--color-txt-main))] placeholder-[rgb(var(--color-txt-dim))] focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 focus:outline-none transition-all"
                          placeholder="e.g. A, B"
                      />
                  </div>
                  <p className="text-xs text-txt-dim mt-1 ml-1">
                      Separate cities with a comma.
                  </p>
              </div>
            </div>

            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-[rgb(var(--color-txt-dim))]" size={16} />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-10 pr-2 py-3 text-[rgb(var(--color-txt-main))] focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">
                  Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 text-[rgb(var(--color-txt-dim))]" size={16} />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-10 pr-2 py-3 text-[rgb(var(--color-txt-main))] focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">
                Available Seats
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-3.5 text-[rgb(var(--color-txt-dim))]" size={18} />
                <input
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  min="1"
                  max="6"
                  required
                  className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-12 pr-4 py-3 text-[rgb(var(--color-txt-main))] focus:border-brand-purple/50 transition-all"
                />
              </div>
            </div>

            
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">
                Rate per Km (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-[rgb(var(--color-txt-dim))]">₹</span>
                <input
                  type="number"
                  name="pricePerKm"
                  value={formData.pricePerKm}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 5"
                  className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-10 pr-4 py-3 text-[rgb(var(--color-txt-main))] focus:border-brand-purple/50 transition-all"
                />
              </div>
              <p className="text-xs text-[rgb(var(--color-txt-dim))] mt-2">
                * The system will calculate the total fare automatically based on distance.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[rgb(var(--color-txt-main))] text-[rgb(var(--color-page))] font-semibold py-3 rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Publish Ride"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}