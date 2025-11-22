import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { MapPin, Calendar, Clock, Search, User, Car, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function FindRide() {
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });

  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setRides([]);

    try {
      const response = await api.get('/rides/search', {
        params: searchParams
      });

      setRides(response.data);
      if (response.data.length === 0) {
        setMessage("No rides found for this route. Try a different date?");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to search rides.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async (rideId) => {
    if (!window.confirm("Confirm booking for 1 seat?")) return;

    setBookingId(rideId);

    try {
      await api.post('/bookings', {
        rideId: rideId,
        seatsBooked: 1
      });

      alert("Booking Successful! Check your dashboard.");
      handleSearch({ preventDefault: () => {} });

    } catch (err) {
      console.error(err);
      alert("Booking failed: " + (err.response?.data || "Unknown error"));
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] flex flex-col transition-colors">
      <Navbar />

      <div className="max-w-5xl mx-auto w-full px-6 pt-32 pb-12">

        {/* Search Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[rgb(var(--color-txt-main))] mb-2">Find your next journey</h1>
          <p className="text-[rgb(var(--color-txt-dim))]">Search for rides shared by our community</p>
        </div>

        

        <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-8 shadow-xl mb-12 relative transition-colors">

          <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

          
            <div className="lg:col-span-5 relative">

              {/* Connecting Route Line */}
              <div className="route-line hidden md:block"></div>

              <div className="space-y-4">

                
                <div className="relative z-10">
                  <div className="absolute left-3 top-3.5 w-4 h-4 rounded-full border-[3px] border-brand-blue bg-[rgb(var(--color-card))]" />
                  <input
                    name="source"
                    value={searchParams.source}
                    onChange={handleChange}
                    placeholder="Leaving from..."
                    required
                    className="w-full bg-[rgb(var(--color-page))] border-0 rounded-lg pl-10 pr-4 py-3 text-[rgb(var(--color-txt-main))] font-medium focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                </div>

              
                <div className="relative z-10">
                  <div className="absolute left-3 top-3.5 w-4 h-4 border-[3px] border-brand-purple bg-[rgb(var(--color-card))]" />
                  <input
                    name="destination"
                    value={searchParams.destination}
                    onChange={handleChange}
                    placeholder="Going to..."
                    required
                    className="w-full bg-[rgb(var(--color-page))] border-0 rounded-lg pl-10 pr-4 py-3 text-[rgb(var(--color-txt-main))] font-medium focus:ring-2 focus:ring-brand-purple/20 transition-all"
                  />
                </div>
              </div>
            </div>

        
            <div className="lg:col-span-4">
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-[rgb(var(--color-txt-dim))]" size={20} />
                <input
                  name="date"
                  type="date"
                  value={searchParams.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-[rgb(var(--color-page))] border-0 rounded-lg pl-12 pr-4 py-3 text-[rgb(var(--color-txt-main))] font-medium focus:ring-2 focus:ring-brand-blue/20 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

           
            <div className="lg:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold h-[52px] rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:translate-y-[-2px]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Search size={20} /> Find Ride
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

   
        <div className="space-y-4">
          {message && (
            <p className="text-center text-[rgb(var(--color-txt-dim))]">{message}</p>
          )}

          {rides.map((ride) => (
            <div
              key={ride.id}
              className="group bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 hover:border-brand-purple/40 rounded-xl p-6 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              {/* Ride Info */}
              <div className="flex items-center gap-6 w-full md:w-auto">

                {/* Time Box */}
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/5 rounded-lg border border-[rgb(var(--color-txt-muted))]/20">
                  <span className="text-lg font-bold text-[rgb(var(--color-txt-main))]">
                    {ride.time.substring(0, 5)}
                  </span>
                  <span className="text-xs text-[rgb(var(--color-txt-dim))] uppercase">Departs</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-[rgb(var(--color-txt-main))]">
                    <span>{ride.source}</span>
                    <span className="text-[rgb(var(--color-txt-dim))]">→</span>
                    <span>{ride.destination}</span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-[rgb(var(--color-txt-dim))]">
                    <div className="flex items-center gap-1">
                      <User size={14} /> {ride.driverName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Car size={14} /> {ride.availableSeats} seats left
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => handleBook(ride.id)}
                disabled={bookingId === ride.id || ride.availableSeats === 0}
                className="w-full md:w-auto px-6 py-3 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {bookingId === ride.id ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  ride.availableSeats === 0 ? "Full" : "Book Seat"
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
