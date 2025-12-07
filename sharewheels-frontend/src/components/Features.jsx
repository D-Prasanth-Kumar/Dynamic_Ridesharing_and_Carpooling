import React from 'react';
import { Car, MapPin, Wallet } from 'lucide-react';

export default function Features() {
  
  const features = [
    {
      title: "Host a Ride",
      desc: "Going somewhere? Share your empty seats. Cut travel costs and meet new people.",
      icon: <Car size={28} />,
      tint: "#f97316"
    },
    {
      title: "Smart Routing",
      desc: "Our algorithm finds the perfect match based on your route deviation and time.",
      icon: <MapPin size={28} />,
      tint: "#3b82f6"
    },
    {
      title: "Fair Pricing",
      desc: "Automatic cost calculation ensures fair prices for passengers and drivers.",
      icon: <Wallet size={28} />,
      tint: "#10b981"
    }
  ];

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-white to-blue-50/40 transition-colors">
      
      {/* Background visual */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, transparent 0%, rgb(var(--color-page)) 80%)"
        }}
      />

      <div className="relative max-w-5xl mx-auto">

        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[rgb(var(--color-txt-main))] mb-6">
            Why travel{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
              with us?
            </span>
          </h2>
          <p className="text-lg text-[rgb(var(--color-txt-dim))] max-w-2xl mx-auto">
            We are not just a booking platform. We are a community moving forward together.
          </p>
        </div>

        {/* ROADMAP */}
        <div className="relative">

          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-[rgb(var(--color-txt-muted))]/20 md:-translate-x-1/2"></div>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  index % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                
                <img
                  src={`/illustrations/feature-decor-${index + 1}.png`}
                  alt=""
                  className={`
                    absolute hidden md:block w-70 opacity-90 pointer-events-none
                    transition-all duration-500
                    top-1/2 -translate-y-1/2
                    ${index % 2 === 0 ? "right-[160px]" : "left-[140px]"}
                  `}
                />

                <div className="flex-1 w-full md:w-auto">
                  <div className="group p-8 rounded-3xl bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 shadow-lg hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                    
                    <div
                      className={`
                      w-14 h-14 rounded-full 
                      flex items-center justify-center mb-6 
                      transition-all duration-300
                    `}
                     style={{
                        backgroundColor: feature.tint + "15",    
                        color: feature.tint,  
                        boxShadow: `0 0 0px ${feature.tint}00`                   
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 20px ${feature.tint}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0px ${feature.tint}00`;
                      }}
                    >
                      {React.cloneElement(feature.icon, { strokeWidth: 2 })}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-[rgb(var(--color-txt-main))]">
                      {feature.title}
                    </h3>

                    <p className="text-[rgb(var(--color-txt-dim))] leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>

                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex flex-col items-center">

                  <div className="w-1 h-8"></div>

                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-orange-500 shadow-[0_0_0_4px_rgb(var(--color-page))]" />
                    <div className="absolute w-8 h-8 rounded-full border border-orange-500/30 animate-ping" />
                  </div>

                  <div className="w-1 h-8"></div>

                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
