import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Calendar, Clock, User, Loader2, Ticket, Star, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  // TIME LIMIT REVIEW RULE
  const isWithinReviewWindow = (dateStr, timeStr) => {
    try {
      const rideDate = new Date(`${dateStr}T${timeStr}`);
      const now = new Date();
      const diff = (now - rideDate) / (1000 * 60 * 60);
      return diff <= 24;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] flex flex-col text-[rgb(var(--color-txt-main))]">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-6 pt-32 pb-12">

        {/* PAGE HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-md">
            <Ticket size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Tickets</h1>
            <p className="text-[rgb(var(--color-txt-dim))]">Your booked rides and travel history</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-purple" size={34} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-[rgb(var(--color-card))] shadow-lg border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl">
            <p className="text-[rgb(var(--color-txt-dim))]">You haven't booked any rides yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b, index) => {
              const canReview = isWithinReviewWindow(b.date, b.time);

              return (
                <div
                  key={index}
                  className="relative bg-[rgb(var(--color-card))] rounded-2xl p-6 md:p-8 border border-[rgb(var(--color-txt-muted))]/20 shadow-md hover:shadow-lg transition-shadow duration-200"
                >

                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-purple to-brand-blue rounded-l-2xl opacity-90" />

                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">

                    {/* Route Title */}
                    <div className="flex items-center gap-2 text-2xl font-extrabold">
                      {b.source}
                      <span className="text-brand-blue mx-2">→</span>
                      {b.destination}
                    </div>

                    <div className="flex items-center gap-2 bg-brand-blue/15 text-brand-blue px-4 py-1.5 rounded-full font-semibold text-sm backdrop-blur">
                      <Clock size={15} /> {b.time?.substring(0, 5) || "--"}
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-xl p-4 min-w-[85px] shadow-inner">
                      <span className="text-sm uppercase font-medium text-[rgb(var(--color-txt-dim))]">
                        {new Date(b.date).toLocaleString("default", { month: "short" })}
                      </span>
                      <span className="text-4xl font-extrabold">{new Date(b.date).getDate()}</span>
                      <span className="text-xs text-[rgb(var(--color-txt-dim))] mt-1">
                        {new Date(b.date).getFullYear()}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                      {/* Driver */}
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-brand-purple" />
                        <span>Driver: <span className="font-semibold text-[rgb(var(--color-txt-main))]">{b.driverName}</span></span>
                      </div>

                      <div>
                        {b.bookingStatus === "COMPLETED" && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gray-200/50 dark:bg-white/10 text-gray-600 border border-gray-400/30">
                            <CheckCircle size={13} /> Completed
                          </span>
                        )}

                        {b.bookingStatus === "CANCELLED" && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-200/30 text-red-500 border border-red-400/40">
                            <AlertCircle size={13} /> Cancelled
                          </span>
                        )}

                        {(b.bookingStatus === "CONFIRMED" || !b.bookingStatus) && (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-200/30 text-emerald-600 border border-emerald-400/30">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Confirmed
                          </span>
                        )}
                      </div>

                      {/* Fare */}
                      {b.totalFare && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-lg text-[rgb(var(--color-txt-main))]">
                            ₹{Math.round(b.totalFare)}
                          </span>
                          <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-[rgb(var(--color-txt-dim))]">
                            Paid
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* REVIEW SECTION */}
                  {b.bookingStatus === "COMPLETED" && (
                    <div className="mt-6 pt-4 border-t border-[rgb(var(--color-txt-muted))]/20 flex justify-end">

                      {!b.hasReviewed ? (
                        canReview ? (
                          <button
                            onClick={() => navigate(`/review/${b.id}`)}
                            className="px-5 py-2 bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-yellow-400/30 transition-all"
                          >
                            <Star size={16} className="fill-yellow-500 text-yellow-500" />
                            Rate Driver
                          </button>
                        ) : (
                          <span className="text-xs italic text-[rgb(var(--color-txt-dim))]">Review period expired</span>
                        )
                      ) : (
                        <span className="text-xs font-bold flex items-center gap-1 text-[rgb(var(--color-txt-muted))]">
                          <Star size={14} className="fill-gray-300 text-gray-300" />
                          You already rated this ride
                        </span>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
