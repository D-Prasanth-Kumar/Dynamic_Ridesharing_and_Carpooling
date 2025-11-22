import React from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Car, Search, Plus, Calendar } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] text-[rgb(var(--color-txt-main))] transition-colors">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue">
              {username}
            </span>
          </h1>

          <p className="text-[rgb(var(--color-txt-dim))]">
            You are logged in as{" "}
            <span className="font-semibold text-[rgb(var(--color-txt-main))]">
              {role}
            </span>
          </p>
        </div>

        {/* DRIVER DASHBOARD */}

        {role === 'DRIVER' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* REGISTER VEHICLE */}
            <div 
              onClick={() => navigate('/register-vehicle')}
              className="group hover-lift p-8 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 cursor-pointer relative overflow-hidden"
            >
              {/* Faded Background Icon */}
              <div className="absolute -right-6 -bottom-6 text-[rgb(var(--color-page))] group-hover:text-[rgba(var(--color-brand-purple),0.10)] transition-colors duration-500">
                <Car size={120} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-violet-500/10 rounded-xl flex items-center justify-center mb-6 text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                  <Car size={28} />
                </div>

                <h3 className="text-xl font-bold mb-2">Register a Vehicle</h3>
                <p className="text-[rgb(var(--color-txt-dim))] text-sm">
                  Add your vehicle before posting rides.
                </p>
              </div>
            </div>

            {/* POST RIDE */}
            <div 
              onClick={() => navigate('/post-ride')}
              className="group hover-lift p-8 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 cursor-pointer relative overflow-hidden"
            >
              {/* Faded Background Icon */}
              <div className="absolute -right-6 -bottom-6 text-[rgb(var(--color-page))] group-hover:text-[rgba(var(--color-brand-purple),0.10)] transition-colors duration-500">
                <Plus size={120} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 
                  bg-[rgba(var(--color-brand-blue),0.1)] 
                  rounded-xl flex items-center justify-center mb-6 
                  text-[rgb(var(--color-brand-blue))] 
                  group-hover:bg-[rgb(var(--color-brand-blue))] 
                  group-hover:text-white 
                  transition-colors"
                >
                  <Plus size={28} />
                </div>

                <h3 className="text-xl font-bold mb-2">Post a Ride</h3>
                <p className="text-[rgb(var(--color-txt-dim))] text-sm">
                  Share your empty seats and earn.
                </p>
              </div>
            </div>

            {/* MY HOSTED RIDES */}
            <div 
              onClick={() => navigate('/my-rides')}
              className="group hover-lift p-8 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 cursor-pointer relative overflow-hidden"
            >
              {/* Faded Background Icon */}
              <div className="absolute -right-6 -bottom-6 text-[rgb(var(--color-page))] group-hover:text-[rgba(var(--color-brand-purple),0.10)] transition-colors duration-500">
                <Calendar size={120} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Calendar size={28} />
                </div>

                <h3 className="text-xl font-bold mb-2">My Hosted Rides</h3>
                <p className="text-[rgb(var(--color-txt-dim))] text-sm">
                  View your past and upcoming rides.
                </p>
              </div>
            </div>

          </div>
        ) : (
          
          /* PASSENGER DASHBOARD */
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* FIND RIDE */}
            <div 
              onClick={() => navigate('/find-ride')}
              className="group hover-lift p-8 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 cursor-pointer relative overflow-hidden"
            >
              {/* Faded Background Icon */}
              <div className="absolute -right-6 -bottom-6 text-[rgb(var(--color-page))] group-hover:text-[rgba(var(--color-brand-purple),0.10)] transition-colors duration-500">
                <Search size={120} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <div
                  className="
                    w-14 h-14
                    bg-[rgba(var(--color-brand-purple),0.1)]
                    rounded-xl flex items-center justify-center mb-6
                    text-[rgb(var(--color-brand-purple))]
                    group-hover:bg-[rgb(var(--color-brand-purple))]
                    group-hover:text-white
                    transition-colors
                  "
                >
                  <Search size={28} />
                </div>

                <h3 className="text-xl font-bold mb-2">Find a Ride</h3>
                <p className="text-[rgb(var(--color-txt-dim))] text-sm">
                  Explore available rides across the community.
                </p>
              </div>
            </div>

            {/* MY BOOKINGS */}
            <div 
              onClick={() => navigate('/my-bookings')}
              className="group hover-lift p-8 rounded-2xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 cursor-pointer relative overflow-hidden"
            >
              {/* Faded Background Icon */}
              <div className="absolute -right-6 -bottom-6 text-[rgb(var(--color-page))] group-hover:text-[rgba(var(--color-brand-purple),0.10)] transition-colors duration-500">
                <Calendar size={120} strokeWidth={1} />
              </div>

              <div className="relative z-10">
                <div
                  className="
                    w-14 h-14 
                    bg-[rgba(var(--color-brand-blue),0.1)] 
                    rounded-xl flex items-center justify-center mb-6
                    text-[rgb(var(--color-brand-blue))]
                    group-hover:bg-[rgb(var(--color-brand-blue))]
                    group-hover:text-white
                    transition-colors
                  "
                >
                  <Calendar size={28} />
                </div>

                <h3 className="text-xl font-bold mb-2">My Bookings</h3>
                <p className="text-[rgb(var(--color-txt-dim))] text-sm">
                  Track your upcoming and past rides.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
