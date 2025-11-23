import React from 'react';
import { useNavigate } from "react-router-dom";
import { MapPin, Car, Shield, Search } from 'lucide-react';
import MapBackground from './MapBackground'; 

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden min-h-[85vh] flex flex-col justify-center">
      
      {/* THE CUSTOM MAP BACKGROUND */}
      <MapBackground />

      <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 shadow-sm mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Designed to Reduce Traffic
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 text-[rgb(var(--color-txt-main))] drop-shadow-sm">
          Your ride, <br />
          <span className="text-brand-blue">your route.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed text-[rgb(var(--color-txt-dim))] font-medium">
          Connect with drivers heading your way. Save money on gas, reduce your carbon footprint, and make travel a shared experience.
        </p>

        {/* ACTION BOX */}
        <div className="max-w-3xl mx-auto bg-[rgb(var(--color-card))] p-2 rounded-full shadow-2xl border border-[rgb(var(--color-txt-muted))]/20 flex flex-col sm:flex-row items-center gap-2">
          
          <button 
            onClick={() => navigate("/find-ride")}
            className="flex-1 h-14 rounded-full bg-[rgb(var(--color-page))] hover:bg-gray-100 dark:hover:bg-gray-800 text-[rgb(var(--color-txt-main))] font-bold transition flex items-center justify-center gap-3 w-full sm:w-auto border border-transparent hover:border-brand-blue/30"
          >
            <MapPin className="text-brand-blue" size={20} />
            <span>Find a ride</span>
          </button>

          <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-700"></div>

          <button 
            onClick={() => navigate("/post-ride")}
            className="flex-1 h-14 rounded-full bg-[rgb(var(--color-txt-main))] text-[rgb(var(--color-page))] font-semibold hover:opacity-90 transition flex items-center justify-center gap-3 w-full sm:w-auto"
          >
            <Car size={20} />
            <span>Share a ride</span>
          </button>
        </div>

        {/* Icons */}
        <div className="mt-12 flex items-center justify-center gap-8 text-[rgb(var(--color-txt-muted))] font-medium">
           <div className="flex items-center gap-2"><Shield size={16} /> Verified Drivers</div>
           <div className="flex items-center gap-2"><Search size={16} /> Smart Ride Search</div>
        </div>

      </div>
    </div>
  );
}