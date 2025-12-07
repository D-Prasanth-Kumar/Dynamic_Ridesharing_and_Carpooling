import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Car, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function RegisterVehicle() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    model: '',
    licensePlate: '',
    capacity: '4'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        model: formData.model,
        licensePlate: formData.licensePlate,
        capacity: parseInt(formData.capacity, 10)
      };

      await api.post('/vehicles', payload);
      navigate('/dashboard');

    } catch (err) {
      let message = "Failed to register vehicle.";
      if (typeof err.response?.data === "string") message = err.response.data;
      else if (err.response?.data?.message) message = err.response.data.message;

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] flex flex-col transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center relative px-6">

       
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-brand-purple/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        
        <div className="relative w-full max-w-md bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-8 shadow-xl backdrop-blur-xl transition-colors">

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-purple">
              <Car size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[rgb(var(--color-txt-main))]">Add a Vehicle</h2>
            <p className="text-[rgb(var(--color-txt-dim))] text-sm mt-2">Provide vehicle details to host rides</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm break-words">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

          
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">
                Car Model
              </label>
              <input
                name="model"
                required
                value={formData.model}
                onChange={handleChange}
                className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-4 pr-4 py-3 
                          text-[rgb(var(--color-txt-main))] placeholder-[rgb(var(--color-txt-dim))] 
                          focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 
                          focus:outline-none transition-all"
                placeholder="e.g., Toyota Camry"
              />
            </div>

           
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">
                License Plate
              </label>
              <input
                name="licensePlate"
                required
                value={formData.licensePlate}
                onChange={handleChange}
                className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-4 pr-4 py-3 
                          text-[rgb(var(--color-txt-main))] placeholder-[rgb(var(--color-txt-dim))] 
                          focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 
                          focus:outline-none transition-all"
                placeholder="e.g., KA-01-AB-1234"
              />
            </div>

          
            <div>
              <label className="block text-xs font-medium text-[rgb(var(--color-txt-muted))] uppercase mb-1">
                Available Seats
              </label>
              <input
                type="number"
                name="capacity"
                min="1"
                max="10"
                required
                value={formData.capacity}
                onChange={handleChange}
                className="w-full bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-lg pl-4 pr-4 py-3 
                          text-[rgb(var(--color-txt-main))] placeholder-[rgb(var(--color-txt-dim))] 
                          focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/50 
                          focus:outline-none transition-all"
              />
            </div>

         
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[rgb(var(--color-txt-main))] text-[rgb(var(--color-page))] font-semibold py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Register Vehicle"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
