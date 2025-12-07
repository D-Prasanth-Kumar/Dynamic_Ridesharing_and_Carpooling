import React from 'react';

export default function MapBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          
          <symbol id="car-realistic" viewBox="0 0 44 20">
            
            <filter id="shadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3"/>
            </filter>
            
            <g filter="url(#shadow)">
              <rect x="4" y="0" width="6" height="2" rx="1" fill="#333" />
              <rect x="30" y="0" width="6" height="2" rx="1" fill="#333" />
              <rect x="4" y="18" width="6" height="2" rx="1" fill="#333" />
              <rect x="30" y="18" width="6" height="2" rx="1" fill="#333" />

              <path d="M2,4 Q2,2 4,2 L38,2 Q42,2 42,5 L42,15 Q42,18 38,18 L4,18 Q2,18 2,16 Z" fill="currentColor" />

              <path d="M10,3 L30,3 L28,17 L10,17 Z" fill="#1a1a1a" opacity="0.8" /> 
              
              <rect x="14" y="3" width="12" height="14" fill="currentColor" filter="brightness(1.2)" />

              <path d="M10,2 L8,1 L10,3" fill="currentColor" />
              <path d="M10,18 L8,19 L10,17" fill="currentColor" />

              <path d="M40,3 L41,3 L41,5 L40,5 Z" fill="#fbbf24" />
              <path d="M40,15 L41,15 L41,17 L40,17 Z" fill="#fbbf24" />
              
              <path d="M2,3 L3,3 L3,5 L2,5 Z" fill="#ef4444" />
              <path d="M2,15 L3,15 L3,17 L2,17 Z" fill="#ef4444" />
            </g>
          </symbol>

          
          <symbol id="bike-realistic" viewBox="0 0 30 12">
            <g filter="url(#shadow)">
              <rect x="22" y="4" width="4" height="4" rx="1" fill="#333" />
              <rect x="0" y="4" width="6" height="4" rx="1" fill="#333" />
              
              <path d="M8,5 L18,5 L20,6 L18,7 L8,7 Z" fill="currentColor" />
              
              <path d="M18,2 L18,10" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
              
              <rect x="4" y="5" width="6" height="2" rx="1" fill="#1a1a1a" />
              
              <circle cx="12" cy="6" r="3" fill="#1a1a1a" />
              <circle cx="12" cy="6" r="1.5" fill="white" opacity="0.3" /> 
            </g>
          </symbol>
        </defs>

        
        <g className="stroke-gray-300 dark:stroke-gray-700 fill-none" strokeLinecap="round" strokeLinejoin="round">
          <path id="road-h" strokeWidth="16" className="opacity-40" d="M-100 320 C 150 320, 300 280, 900 380" />
          <path id="road-v" strokeWidth="16" className="opacity-40" d="M280 -100 C 280 150, 320 400, 200 700" />
          <path id="road-coast" strokeWidth="12" className="opacity-30" d="M550 -100 C 550 200, 700 300, 950 450" />
          <path id="road-connect" strokeWidth="10" className="opacity-30" d="M-50 450 C 100 450, 200 420, 280 380" />
        </g>

        
        <g className="text-gray-100 dark:text-gray-300">
          <use href="#car-realistic" width="30" height="14" x="-15" y="-7">
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
              <mpath href="#road-h" />
            </animateMotion>
          </use>
        </g>

        <g className="text-slate-700 dark:text-slate-500">
          <use href="#car-realistic" width="30" height="14" x="-15" y="-7">
            <animateMotion dur="18s" repeatCount="indefinite" rotate="auto" begin="3s">
              <mpath href="#road-v" />
            </animateMotion>
          </use>
        </g>

        <g className="text-orange-500">
          <use href="#bike-realistic" width="20" height="8" x="-10" y="-4">
            <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" begin="0s">
               <mpath href="#road-v" />
            </animateMotion>
          </use>
        </g>

        <g className="text-blue-600 dark:text-blue-500">
          <use href="#car-realistic" width="30" height="14" x="-15" y="-7">
            <animateMotion dur="20s" repeatCount="indefinite" rotate="auto" begin="5s">
              <mpath href="#road-coast" />
            </animateMotion>
          </use>
        </g>

        <g className="text-red-600">
          <use href="#bike-realistic" width="20" height="8" x="-10" y="-4">
            <animateMotion dur="12s" repeatCount="indefinite" rotate="auto" begin="1s">
              <mpath href="#road-connect" />
            </animateMotion>
          </use>
        </g>

      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgb(var(--color-page))_100%)] pointer-events-none"></div>
    </div>
  );
}