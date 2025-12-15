import React, { useEffect } from 'react';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Car, Search, Plus, Calendar, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === 'ADMIN') {
        navigate('/admin-dashboard', { replace: true });
    }
  }, [role, navigate]);

  if (role === 'ADMIN') return null;

  const driverCards = [
    {
      title: "Post a Ride",
      desc: "Share your empty seats and earn.",
      icon: <Plus size={28} />,
      path: "/post-ride",
      lightColor: "bg-blue-100 text-blue-600",
    },
    {
      title: "My Hosted Rides",
      desc: "Track your upcoming journeys.",
      icon: <Calendar size={28} />,
      path: "/my-rides",
      lightColor: "bg-purple-100 text-purple-600",
    },
    {
      title: "Register Vehicle",
      desc: "Add a car to start driving.",
      icon: <Car size={28} />,
      path: "/register-vehicle",
      lightColor: "bg-orange-100 text-orange-600",
    },
  ];

  const passengerCards = [
    {
      title: "Find a Ride",
      desc: "Book a seat on an existing route.",
      icon: <Search size={28} />,
      path: "/find-ride",
      lightColor: "bg-blue-100 text-blue-600",
    },
    {
      title: "My Bookings",
      desc: "View your tickets and history.",
      icon: <Calendar size={28} />,
      path: "/my-bookings",
      lightColor: "bg-purple-100 text-purple-600",
    },
  ];

  const cards = role === "DRIVER" ? driverCards : passengerCards;

  return (
    <div className="min-h-screen bg-page text-txt-main transition-colors duration-300">
      <Navbar />

      <div className="relative w-full bg-page overflow-hidden">
        

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-txt-main">
              Hello,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                {username}
              </span>
            </h1>

            <p className="text-lg text-txt-dim mb-8 max-w-md leading-relaxed">
              {role === "DRIVER"
                ? "Ready to hit the road? Share your journey and cover your fuel costs today."
                : "Where are you heading? Find a comfortable and affordable ride now."}
            </p>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end relative">
            <img
              src={
                role === "DRIVER"
                  ? "/illustrations/city-driver.svg"
                  : "/illustrations/city-passenger.svg"
              }
              alt="Dashboard Illustration"
              className="w-full max-w-md drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>


      <div className="relative z-20 max-w-7xl mx-auto px-6 -mt-32 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="group bg-card p-8 rounded-3xl border border-txt-muted/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${card.lightColor}`}
                >
                  {card.icon}
                </div>

                <h3 className="text-2xl font-bold text-txt-main mb-2 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>

                <p className="text-txt-dim mb-8 flex-grow">{card.desc}</p>

                <div className="flex items-center gap-2 text-sm font-bold text-blue-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Action <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24 text-center">
        <p className="text-sm font-bold text-txt-dim uppercase tracking-widest mb-4">
          Why ShareWheels?
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-txt-dim text-sm">
          <span className="px-4 py-2 rounded-full bg-input border border-txt-muted/20">
            Eco-Friendly
          </span>
          <span className="px-4 py-2 rounded-full bg-input border border-txt-muted/20">
            Low Cost
          </span>
          <span className="px-4 py-2 rounded-full bg-input border border-txt-muted/20">
            Secure Payments
          </span>
        </div>
      </div>
    </div>
  );
}
