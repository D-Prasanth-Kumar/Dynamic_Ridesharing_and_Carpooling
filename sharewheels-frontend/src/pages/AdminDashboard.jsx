import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  Users, Car, CreditCard, Activity, CheckCircle, Shield, Star, 
  MessageSquare, X, MapPin, Clock, Calendar, Filter 
} from 'lucide-react';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalRides: 0, totalBookings: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [allRides, setAllRides] = useState([]);

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  // MODALS
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isRidesModalOpen, setIsRidesModalOpen] = useState(false);

  // Reviews
  const [selectedUserReviews, setSelectedUserReviews] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Search (used inside users modal)
  const [userSearch, setUserSearch] = useState("");

  // SORTING (used inside users modal)
  const [sortBy, setSortBy] = useState("newest");

  // Reports
  const [reportDates, setReportDates] = useState({ from: '', to: '' });
  const [reportData, setReportData] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch users again when sort changes & modal is open
  useEffect(() => {
    if (isUsersModalOpen) {
      fetchUsersOnly();
    }
  }, [sortBy]);

  const fetchData = async () => {
    try {
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data || { totalUsers:0, totalRides:0, totalBookings:0, totalRevenue:0 });

      await fetchUsersOnly();

      const chartRes = await api.get('/admin/chart');
      setChartData(chartRes.data || []);
    } catch (err) {
      console.error("Admin Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersOnly = async () => {
    try {
      const res = await api.get('/admin/users', {
        params: { sortBy }
      });
      setUsers(Array.isArray(res.data) ? res.data : res.data?.users || []);
    } catch (err) {
      console.error("Fetch Users Failed:", err);
    }
  };

  // ----------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------

  const handleViewAllRides = async () => {
    try {
        console.log("Fetching rides..."); // Debug log
        const res = await api.get('/admin/rides');
        setAllRides(res.data || []);
        setIsRidesModalOpen(true);
    } catch (err) {
        console.error(err);
        alert("Failed to load rides. Make sure Backend is restarted!");
    }
  };

  const handleBlockUser = async (userId) => {
    if (!window.confirm("Are you sure you want to block/unblock this user?")) return;

    try {
        await api.put(`/admin/users/${userId}/block`);
        alert("User status updated.");
        fetchUsersOnly(); // Refresh list to see change
    } catch (err) {
        alert("Failed to update user.");
    }
  };

  const handleGenerateReport = async () => {
    if (!reportDates.from || !reportDates.to) {
      alert("Please select both From and To dates.");
      return;
    }
    
    setReportLoading(true);
    try {
      const res = await api.get(`/admin/report`, {
        params: { from: reportDates.from, to: reportDates.to }
      });
      setReportData(res.data); 
      setIsReportModalOpen(true); 
    } catch (err) {
      console.error(err);
      alert("Failed to generate report. Check your dates.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleViewReviews = async (userId) => {
    try {
        const res = await api.get(`/admin/users/${userId}/reviews`);
        setSelectedUserReviews(res.data || []);
        setIsReviewModalOpen(true);
    } catch (err) {
        alert("Could not fetch reviews.");
    }
  };

  // FILTERED USERS
  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen bg-page text-txt-main flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] text-[rgb(var(--color-txt-main))] transition-colors">
      <Navbar />

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-700 shadow-md">
                <Shield />
              </span>
              <span>Admin Portal</span>
            </h1>
            <p className="text-[rgb(var(--color-txt-dim))] mt-1">
              System Overview & Monitoring
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-lg text-sm font-bold hover:shadow-md transition"
            >
              Refresh
            </button>
            <button
              onClick={() => setIsUsersModalOpen(true)}
              className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-bold hover:opacity-90 transition"
            >
              Manage Users
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div onClick={() => setIsUsersModalOpen(true)} className="cursor-pointer hover:scale-105 transition">
            <StatCard icon={<Users />} title="Total Users" value={stats.totalUsers} color="bg-yellow-500" />
          </div>

          <div onClick={handleViewAllRides} className="cursor-pointer hover:scale-105 transition">
            <StatCard icon={<Car />} title="Total Rides" value={stats.totalRides} color="bg-purple-500" />
          </div>

          <StatCard icon={<Activity />} title="Total Bookings" value={stats.totalBookings} color="bg-orange-500" />
          <StatCard icon={<CreditCard />} title={`₹${stats.totalRevenue}`} value="" color="bg-emerald-500" />
        </div>

        {/* CHART + REPORT GENERATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1 bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Ride Activity (Last 7 Days)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="rides" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-6 shadow-lg">
            <h4 className="text-lg font-semibold mb-1">Generate Report</h4>
            <p className="text-sm text-[rgb(var(--color-txt-dim))] mb-6">
              Select a date range to generate financial & ride reports
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[rgb(var(--color-txt-dim))] uppercase mb-1">From Date</label>
                <input
                  type="date"
                  value={reportDates.from}
                  onChange={(e) => setReportDates({...reportDates, from: e.target.value})}
                  className="w-full rounded-lg px-4 py-2 border border-[rgb(var(--color-txt-muted))]/20 bg-[rgb(var(--color-page))] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[rgb(var(--color-txt-dim))] uppercase mb-1">To Date</label>
                <input
                  type="date"
                  value={reportDates.to}
                  onChange={(e) => setReportDates({...reportDates, to: e.target.value})}
                  className="w-full rounded-lg px-4 py-2 border border-[rgb(var(--color-txt-muted))]/20 bg-[rgb(var(--color-page))] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button 
                onClick={handleGenerateReport}
                disabled={reportLoading}
                className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {reportLoading ? <>Processing...</> : <>Generate Report <Filter size={16}/></>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- USERS MODAL ---------------- */}
      {isUsersModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsUsersModalOpen(false)} />
          <div className="relative w-full max-w-5xl bg-[rgb(var(--color-card))] rounded-2xl shadow-2xl border border-[rgb(var(--color-txt-muted))]/20 p-6 max-h-[85vh] flex flex-col overflow-hidden">
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-[rgb(var(--color-txt-muted))]/20 pb-4">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Users size={24} className="text-blue-500" /> User Management
              </h3>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative">
                  <Filter className="absolute left-3 top-2.5 text-[rgb(var(--color-txt-dim))]" size={16} />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 text-sm cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="alphabetical">A–Z Name</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 w-full md:w-48"
                />
                <button onClick={() => setIsUsersModalOpen(false)}>
                  <X size={24} className="hover:text-red-500 transition" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white/5 backdrop-blur-md text-xs uppercase text-[rgb(var(--color-txt-dim))]">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgb(var(--color-txt-muted))]/10">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition">
                      
                      <td className="px-4 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 font-bold flex items-center justify-center">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold">{user.name}</p>
                          <p className="text-xs text-[rgb(var(--color-txt-dim))]">{user.email}</p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === "DRIVER" ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"}`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 font-bold">
                          <Star size={14} className="fill-yellow-500 text-yellow-500" />
                          {user.averageRating || "N/A"}
                        </div>
                        {user.averageRating > 0 && (
                          <button onClick={() => handleViewReviews(user.id)} className="text-blue-500 hover:underline text-[10px] mt-1">
                            See Reviews
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {/* 🔴 FIXED: Check BOTH blocked OR isBlocked to be safe */}
                        {(user.blocked || user.isBlocked) ? (
                          <span className="text-red-500 font-bold text-xs flex items-center gap-1">
                            🚫 Blocked
                          </span>
                        ) : (
                          <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                            <CheckCircle size={12} /> Active
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <button 
                          onClick={() => handleBlockUser(user.id)} 
                          className={`font-bold text-xs hover:underline ${(user.blocked || user.isBlocked) ? "text-emerald-500" : "text-red-500"}`}
                        >
                          {/* 🔴 FIXED: Check BOTH here too */}
                          {(user.blocked || user.isBlocked) ? "Unblock" : "Block"}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- RIDES MODAL ---------------- */}
      {isRidesModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsRidesModalOpen(false)} />
          <div className="relative w-full max-w-5xl bg-[rgb(var(--color-card))] rounded-2xl shadow-2xl border border-[rgb(var(--color-txt-muted))]/20 p-6 max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6 border-b border-[rgb(var(--color-txt-muted))]/20 pb-4">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Car size={24} className="text-purple-500" /> Master Ride History
              </h3>
              <button onClick={() => setIsRidesModalOpen(false)}>
                <X size={24} className="hover:text-red-500 transition" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-white/5 backdrop-blur-md text-xs uppercase text-[rgb(var(--color-txt-dim))]">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Driver</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgb(var(--color-txt-muted))]/10">
                  {allRides.map((ride) => (
                    <tr key={ride.id} className="hover:bg-white/5 transition">
                      <td className="px-4 py-4 font-mono text-xs text-[rgb(var(--color-txt-dim))]">#{ride.id}</td>
                      <td className="px-4 py-4">
                        <p className="font-bold">{ride.driverName}</p>
                        <p className="text-xs text-[rgb(var(--color-txt-dim))]">{ride.vehicleModel}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{ride.source}</span>
                          <span className="text-[rgb(var(--color-txt-dim))]">→</span>
                          <span className="font-medium">{ride.destination}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-txt-dim))]">
                          <Calendar size={12} /> {ride.date}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {ride.status === 'COMPLETED' && <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1"><CheckCircle size={12} /> DONE</span>}
                        {ride.status === 'CANCELLED' && <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/10 text-red-500 flex items-center gap-1"><X size={12} /> CANCELLED</span>}
                        {ride.status === 'SCHEDULED' && <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-500 flex items-center gap-1"><Clock size={12} /> ACTIVE</span>}
                      </td>
                      <td className="px-4 py-4 text-right font-bold">
                        {ride.totalFare ? `₹${Math.round(ride.totalFare)}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- REVIEW MODAL ---------------- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[rgb(var(--color-card))] rounded-2xl shadow-2xl border border-[rgb(var(--color-txt-muted))]/20 p-6 max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4 border-b border-[rgb(var(--color-txt-muted))]/20 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare size={20} className="text-brand-purple" /> User Reviews
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {selectedUserReviews?.length > 0 ? (
                selectedUserReviews.map((review) => (
                  <div key={review.id} className="p-4 bg-white/5 border border-[rgb(var(--color-txt-muted))]/20 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{review.reviewerName || "Anonymous"}</p>
                          <p className="text-[10px] text-[rgb(var(--color-txt-dim))]">{review.timestamp ? new Date(review.timestamp).toLocaleDateString() : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
                        <Star size={12} className="fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-500">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-[rgb(var(--color-txt-main))] italic">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-[rgb(var(--color-txt-dim))] py-10">No reviews found for this user.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- REPORT MODAL ---------------- */}
      {isReportModalOpen && reportData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReportModalOpen(false)} />
            <div className="relative w-full max-w-4xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-[rgb(var(--color-txt-muted))]/20 pb-4">
                    <div>
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Calendar size={24} className="text-pink-500" /> Report Results
                        </h3>
                        <p className="text-sm text-[rgb(var(--color-txt-dim))] mt-1">
                            {reportDates.from} <span className="mx-1">to</span> {reportDates.to}
                        </p>
                    </div>
                    <button onClick={() => setIsReportModalOpen(false)}><X size={24} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl text-center">
                        <p className="text-xs text-purple-500 font-bold uppercase">Total Rides</p>
                        <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{reportData.totalRides}</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
                        <p className="text-xs text-emerald-500 font-bold uppercase">Revenue Generated</p>
                        <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{reportData.totalRevenue}</p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="sticky top-0 bg-white/5 backdrop-blur-md text-xs uppercase text-[rgb(var(--color-txt-dim))]">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Route</th>
                                <th className="px-4 py-3">Driver</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Fare</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgb(var(--color-txt-muted))]/10">
                            {reportData.rides.length > 0 ? (
                                reportData.rides.map((ride) => (
                                    <tr key={ride.id} className="hover:bg-white/5">
                                        <td className="px-4 py-3 text-xs">{ride.date}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-bold">{ride.source}</span> 
                                            <span className="text-xs text-gray-500 mx-1">➜</span> 
                                            <span className="font-bold">{ride.destination}</span>
                                        </td>
                                        <td className="px-4 py-3">{ride.driverName}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ride.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                                                {ride.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono">₹{ride.totalFare}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                        No rides found in this date range.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-xl transition">
      <div className={`p-3 rounded-xl text-white ${color} shadow-lg`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <div>
        <p className="text-sm text-[rgb(var(--color-txt-dim))] uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}