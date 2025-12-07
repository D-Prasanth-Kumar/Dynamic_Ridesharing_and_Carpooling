import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Calendar, Clock, Users, Loader2, Car, X, Phone, User } from 'lucide-react';
import api from '../services/api';

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRideId, setSelectedRideId] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [isLoadingPassengers, setIsLoadingPassengers] = useState(false);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await api.get('/rides/my-rides');
        setRides(response.data);
      } catch (err) {
        console.error("Failed to fetch rides", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRides();
  }, []);

  const handleViewPassengers = async (rideId) => {
    setSelectedRideId(rideId);
    setIsLoadingPassengers(true);
    setPassengers([]);

    try {
      const response = await api.get(`/rides/${rideId}/bookings`);
      setPassengers(response.data);
    } catch (err) {
      console.error("Failed to fetch passengers", err);
      alert("Could not load passenger details.");
    } finally {
      setIsLoadingPassengers(false);
    }
  };

  const closeModal = () => {
    setSelectedRideId(null);
    setPassengers([]);
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] text-[rgb(var(--color-txt-main))] flex flex-col transition-colors">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-6 pt-32 pb-12">

        
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-brand-purple/20 rounded-full flex items-center justify-center text-brand-purple">
            <Car size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Hosted Rides</h1>
            <p className="text-[rgb(var(--color-txt-dim))]">Manage your published journeys</p>
          </div>
        </div>

       
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-purple" size={32} />
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-20 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl">
            <p className="text-[rgb(var(--color-txt-dim))]">You haven't posted any rides yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-purple/40 transition-all"
              >
                {/* Ride info */}
                <div className="flex items-center gap-6 w-full md:w-auto">

                 
                  <div className="text-center min-w-[60px]">
                    <div className="text-xl font-bold">{new Date(ride.date).getDate()}</div>
                    <div className="text-xs text-[rgb(var(--color-txt-dim))] uppercase">
                      {new Date(ride.date).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>

                  <div className="h-10 w-[1px] bg-[rgb(var(--color-txt-muted))]/20 hidden md:block" />

                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {ride.source} <span className="text-[rgb(var(--color-txt-dim))]">→</span> {ride.destination}
                    </h3>

                    <div className="flex items-center gap-4 mt-1 text-sm text-[rgb(var(--color-txt-dim))]">
                      <span className="flex items-center gap-1"><Clock size={14}/> {ride.time.substring(0, 5)}</span>
                      <span className="flex items-center gap-1"><Users size={14}/> {ride.availableSeats} seats remaining</span>
                    </div>
                  </div>

                </div>

                <div className="w-full md:w-auto">
                  <button
                    onClick={() => handleViewPassengers(ride.id)}
                    className="w-full md:w-auto px-6 py-2 rounded-lg bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 hover:bg-white/10 text-sm font-medium transition-colors"
                  >
                    View Passengers
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      
      {selectedRideId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">

         
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

        
          <div className="relative w-full max-w-lg bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl shadow-xl overflow-hidden">

            <div className="flex items-center justify-between p-6 border-b border-[rgb(var(--color-txt-muted))]/20 bg-white/5">
              <h3 className="text-xl font-bold">Passenger List</h3>
              <button
                onClick={closeModal}
                className="text-[rgb(var(--color-txt-dim))] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">

              {isLoadingPassengers ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-brand-purple" size={24} />
                </div>
              ) : passengers.length === 0 ? (
                <div className="text-center py-10 text-[rgb(var(--color-txt-dim))]">
                  No passengers booked this ride yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {passengers.map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-[rgb(var(--color-txt-muted))]/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                          <User size={20} />
                        </div>

                        <div>
                          <p className="font-semibold">{p.passengerName}</p>
                          <p className="text-xs text-[rgb(var(--color-txt-dim))]">
                            {p.seatsBooked} seat(s) booked
                          </p>
                        </div>
                      </div>

                      <a
                        href={`tel:${p.passengerPhone}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors text-sm font-medium"
                      >
                        <Phone size={16} />
                        {p.passengerPhone}
                      </a>

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
