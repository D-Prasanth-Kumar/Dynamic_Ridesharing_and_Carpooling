import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Calendar, Clock, User, Loader2, Ticket } from 'lucide-react';
import api from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/my-bookings');
        setBookings(response.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] flex flex-col text-[rgb(var(--color-txt-main))] transition-colors">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-6 pt-32 pb-12">

       
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-brand-blue/20 rounded-full flex items-center justify-center text-brand-blue">
            <Ticket size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Tickets</h1>
            <p className="text-[rgb(var(--color-txt-dim))]">Upcoming trips and travel history</p>
          </div>
        </div>

       
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-purple" size={32} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl">
            <p className="text-[rgb(var(--color-txt-dim))]">You haven't booked any rides yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((ride, index) => (
              <div
                key={index}
                className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden group hover:border-brand-blue/40 transition-all"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-purple to-brand-blue opacity-80" />

                {/* Date */}
                <div className="flex flex-col items-center justify-center min-w-[80px] bg-white/5 rounded-xl p-4 border border-[rgb(var(--color-txt-muted))]/20">
                  <span className="text-sm text-[rgb(var(--color-txt-dim))] uppercase font-medium">
                    {new Date(ride.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-3xl font-bold">{new Date(ride.date).getDate()}</span>
                  <span className="text-xs text-[rgb(var(--color-txt-muted))] mt-1">
                    {new Date(ride.date).getFullYear()}
                  </span>
                </div>

                {/* Ride Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xl font-bold">
                      {ride.source}
                      <span className="text-[rgb(var(--color-txt-dim))] mx-2">→</span>
                      {ride.destination}
                    </div>

                    <div className="flex items-center gap-2 text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full text-xs font-semibold mt-2 md:mt-0 w-fit">
                      <Clock size={14} /> {ride.time.substring(0, 5)}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-[rgb(var(--color-txt-dim))]">
                    <div className="flex items-center gap-2">
                      <User size={16} /> Driver:{" "}
                      <span className="text-[rgb(var(--color-txt-main))]">{ride.driverName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      Status: <span className="text-emerald-500">Confirmed</span>
                    </div>
                  </div>

                  {ride.totalFare && (
                    <div className="flex items-center gap-2 mt-4">
                        <span className="text-txt-main font-bold">₹{Math.round(ride.totalFare)}</span>
                        <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-txt-dim">Paid</span>
                    </div>
                )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
