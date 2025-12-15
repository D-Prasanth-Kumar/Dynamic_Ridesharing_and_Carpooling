import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Clock, Users, Loader2, Car, X, User, Trash2, Edit2, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [passengers, setPassengers] = useState([]);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  const [editingRide, setEditingRide] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', time: '', availableSeats: '' });

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await api.get('/rides/my-rides');
      setRides(response.data);
    } catch (err) {
      console.error('Failed to fetch rides', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRideStatus = (ride) => {
    if (ride.status === 'CANCELLED') return 'CANCELLED';
    if (ride.status === 'COMPLETED') return 'COMPLETED';

    const rideDateTime = new Date(`${ride.date}T${ride.time}`);
    if (rideDateTime < new Date()) return 'COMPLETED';

    return 'SCHEDULED';
  };

  const handleCancelRide = async (rideId) => {
    if (!window.confirm('Are you sure? This will cancel the ride for ALL passengers.')) return;

    try {
      await api.put(`/rides/${rideId}/cancel`);
      alert('Ride cancelled successfully.');

      setRides((prev) =>
        prev.map((r) => (r.id === rideId ? { ...r, status: 'CANCELLED' } : r))
      );
    } catch (err) {
      alert('Failed to cancel: ' + (err.response?.data || 'Error'));
    }
  };

  // Mark ride completed
  const handleCompleteRide = async (rideId) => {
    if (!window.confirm('Mark this ride as Completed? This will notify passengers to review you.')) {
      return;
    }

    try {
      await api.put(`/rides/${rideId}/complete`);
      alert('Ride completed! Emails sent to passengers.');

      setRides((prev) =>
        prev.map((r) => (r.id === rideId ? { ...r, status: 'COMPLETED' } : r))
      );
    } catch (err) {
      alert('Failed to complete: ' + (err.response?.data || 'Error'));
    }
  };

  // Edit ride
  const handleEditClick = (ride) => {
    setEditingRide(ride);
    setEditForm({
      date: ride.date,
      time: ride.time,
      availableSeats: ride.availableSeats,
    });
  };

  const handleUpdateRide = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/rides/${editingRide.id}`, {
        ...editForm,
        source: editingRide.source,
        destination: editingRide.destination,
      });

      alert('Ride updated successfully');
      setEditingRide(null);
      fetchRides();
    } catch (err) {
      alert('Failed to update ride: ' + (err.response?.data || 'Error'));
    }
  };

  // View passengers
  const handleViewPassengers = async (rideId) => {
    try {
      const response = await api.get(`/rides/${rideId}/bookings`);
      setPassengers(response.data);
      setShowPassengerModal(true);
    } catch (err) {
      alert('Could not fetch passengers');
    }
  };

  return (
    <div className="min-h-screen bg-page text-txt-main flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="max-w-4xl mx-auto w-full px-6 pt-32 pb-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shadow-md">
            <Car size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Hosted Rides</h1>
            <p className="text-txt-dim">Manage your past and upcoming trips</p>
          </div>
        </div>

        {/* Ride List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-purple" size={32} />
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-20 bg-card border border-txt-muted/20 rounded-2xl">
            <p className="text-txt-dim">You haven't posted any rides yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rides.map((ride) => {
              const status = getRideStatus(ride);
              const isCancelled = status === 'CANCELLED';
              const isCompleted = status === 'COMPLETED';
              const isScheduled = status === 'SCHEDULED';

              return (
                <div
                  key={ride.id}
                  className={`bg-card border border-txt-muted/20 rounded-2xl p-6 flex flex-col 
                    md:flex-row items-center justify-between gap-6 transition-all
                    ${isCancelled ? 'opacity-60 grayscale' : 'hover:shadow-lg'}
                  `}
                >
                  {/* Ride info */}
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    
                    <div
                      className={`flex flex-col items-center justify-center min-w-[70px] rounded-xl p-3 border
                        ${
                          isCompleted
                            ? 'bg-gray-100 border-gray-300 text-gray-500'
                            : isCancelled
                            ? 'bg-gray-200 border-gray-300 text-gray-500'
                            : 'bg-input border-txt-muted/20'
                        }
                      `}
                    >
                      <span className="text-sm uppercase font-bold">
                        {new Date(ride.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-bold">
                        {new Date(ride.date).getDate()}
                      </span>
                    </div>

                    {/* Route + details */}
                    <div>
                      <h3
                        className={`text-lg font-semibold flex items-center gap-2 
                          ${isCancelled ? 'line-through text-gray-500' : ''}
                        `}
                      >
                        {ride.source} <span className="text-txt-dim">→</span> {ride.destination}
                      </h3>

                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-txt-dim">
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {ride.time.substring(0, 5)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {ride.availableSeats} seats
                        </span>

                        
                        {isCancelled && (
                          <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded text-xs font-bold border border-red-300">
                            CANCELLED
                          </span>
                        )}

                        {isCompleted && (
                          <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs font-bold border border-gray-300 flex items-center gap-1">
                            <CheckCircle size={10} /> COMPLETED
                          </span>
                        )}

                        {isScheduled && (
                          <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-xs font-bold border border-emerald-300 animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleViewPassengers(ride.id)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-txt-muted/20 hover:bg-gray-200 
                                 text-sm font-medium transition-colors"
                    >
                      Passengers
                    </button>

                    {isScheduled && (
                      <>
                        {/* Complete */}
                        <button
                          onClick={() => handleCompleteRide(ride.id)}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white 
                                     border border-emerald-300 transition"
                          title="Mark Completed"
                        >
                          <CheckCircle size={18} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleEditClick(ride)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white 
                                     border border-blue-300 transition"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>

                        {/* Cancel */}
                        <button
                          onClick={() => handleCancelRide(ride.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white 
                                     border border-red-300 transition"
                          title="Cancel"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingRide(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Edit Ride</h3>
              <button onClick={() => setEditingRide(null)}>
                <X size={22} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateRide} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Time</label>
                <input
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Seats</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={editForm.availableSeats}
                  onChange={(e) =>
                    setEditForm({ ...editForm, availableSeats: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-md transition"
              >
                Update Ride
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Passenger Modal */}
      {showPassengerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPassengerModal(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Passenger List</h3>
              <button onClick={() => setShowPassengerModal(false)}>
                <X size={20} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {passengers.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No passengers yet.</p>
              ) : (
                passengers.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                        <User size={18} className="text-purple-700" />
                      </div>

                      <div className="leading-tight">
                        <p className="font-medium text-gray-800">{p.passengerName}</p>
                        <p className="text-xs text-gray-500">{p.seatsBooked} seats</p>
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-semibold">
                      {p.passengerPhone}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
