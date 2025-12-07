import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Car, ArrowRight, Search, CheckCircle } from "lucide-react";
import MapBackground from "./MapBackground";
import carImage from "../assets/carpool-animation.svg";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-page transition-colors duration-300 overflow-x-hidden">

      <div className="relative flex items-center min-h-screen w-full bg-gradient-to-b from-blue-50/50 to-white">

        <div className="relative max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 w-full pt-20">

          <div className="lg:w-1/2 text-left z-10 space-y-8">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Making daily travel smarter & affordable
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-txt-main leading-[1.1] tracking-tight">
              Share Rides. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Save Money.
              </span>
            </h1>

            <p className="text-lg text-txt-dim max-w-lg leading-relaxed">
              Find trusted drivers heading your way and enjoy a simpler, smoother, and more affordable commute.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => navigate("/find-ride")}
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-600/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Search size={20} /> Find a Ride
              </button>

              <button
                onClick={() => navigate("/post-ride")}
                className="px-8 py-4 rounded-xl bg-white border border-gray-200 text-txt-main font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Car size={20} /> Offer a Ride
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4 opacity-90">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" />
                <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              </div>

              <div className="text-sm">
                <p className="font-bold text-txt-main">We connect passengers with drivers taking the same route.</p>
                <p className="text-txt-dim text-xs">Your smarter way to get around.</p>
              </div>
            </div>

          </div>

          <div className="lg:w-1/2 flex justify-center md:justify-end z-10 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl scale-90"></div>
            <img
              src={carImage}
              alt="Carpool Illustration"
              className="w-full max-w-[600px] drop-shadow-2xl relative hover:scale-105 transition-transform duration-700"
            />
          </div>

        </div>
      </div>



      <div className="relative w-full min-h-[90vh] py-32 bg-white overflow-hidden flex items-center justify-center">

        <div className="absolute inset-0 opacity-95">
          <MapBackground />  
        </div>

        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
        <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-white to-transparent"></div>
        <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-white to-transparent"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 drop-shadow">
            Smart Route Matching
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12 drop-shadow">
            Our algorithm helps you find the best ride by matching drivers and passengers heading the same direction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="p-6 bg-white/30 backdrop-blur-xl border border-gray-300/40 shadow-lg rounded-2xl hover:bg-white/70 transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin size={22} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Clear Route Insight</h3>
              <p className="text-sm text-slate-600 mt-1">
                View pickup, drop and distance clearly on the map.
              </p>
            </div>

            <div className="p-6 bg-white/30 backdrop-blur-xl border border-gray-300/40 shadow-lg rounded-2xl hover:bg-white/70 transition-all">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Car size={22} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Driver Transparency</h3>
              <p className="text-sm text-slate-600 mt-1">
                Check driver info clearly before booking.
              </p>
            </div>

            <div className="p-6 bg-white/30 backdrop-blur-xl border border-gray-300/40 shadow-lg rounded-2xl hover:bg-white/70 transition-all">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <ArrowRight size={22} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Smooth Coordination</h3>
              <p className="text-sm text-slate-600 mt-1">
                Share trip details and coordinate easily.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
