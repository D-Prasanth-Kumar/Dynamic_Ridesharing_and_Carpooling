import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { MapPin, Calendar, Search, User, Car, Loader2, X, Minus, Plus } from 'lucide-react';
import api from '../services/api';

const RAZORPAY_KEY_ID = "rzp_test_RkO1Mof5ZeG8sg"; 

export default function FindRide() {
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    date: ''
  });

  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [selectedRide, setSelectedRide] = useState(null);
  const [viewDriver, setViewDriver] = useState(null);
  const [seatCount, setSeatCount] = useState(1);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setRides([]);

    try {
      const response = await api.get('/rides/search', {
        params: searchParams
      });

      setRides(response.data);
      if (response.data.length === 0) {
        setMessage("No rides found for this route. Try a different date?");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to search rides.");
    } finally {
      setIsLoading(false);
    }
  };

  const openBookingModal = (ride) => {
    setSelectedRide(ride);
    setSeatCount(1);
  };

  const closeBookingModal = () => {
    setSelectedRide(null);
    setIsBookingLoading(false);
  };

  const updateSeats = (operation) => {
    if (!selectedRide) return;
    if (operation === 'increase' && seatCount < selectedRide.availableSeats) {
      setSeatCount(prev => prev + 1);
    } else if (operation === 'decrease' && seatCount > 1) {
      setSeatCount(prev => prev - 1);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const handleConfirmBooking = async () => {

    const isLoaded = await loadRazorpayScript();
    
    if (!isLoaded) {
      alert("Razorpay SDK failed to load.");
      setIsBookingLoading(false);
      return;
    }


    if (!selectedRide) return;
    setIsBookingLoading(true);

    let rawAmount = selectedRide.pricePerKm 
        ? (selectedRide.distanceKm * selectedRide.pricePerKm * seatCount) 
        : (selectedRide.price * seatCount);


    const finalAmount = Math.round(rawAmount);

    
    if (!finalAmount || isNaN(finalAmount)) {
        alert("Error calculating fare. Please check ride details.");
        setIsBookingLoading(false);
        return;
    }


    try {
        
        const orderResponse = await api.post('/payments/create-order', {
            amount: finalAmount
        });
        
        const { orderId } = orderResponse.data;

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: finalAmount * 100, // Amount in paise (integer)
            currency: "INR",
            name: "ShareWheels",
            description: `Ride to ${selectedRide.destination}`,
            order_id: orderId,

            handler: async function (response) {
                
                try {
                    await api.post('/bookings', {
                        rideId: selectedRide.id,
                        seatsBooked: seatCount,
                        paymentId: response.razorpay_payment_id,
                        source: searchParams.source,      
                        destination: searchParams.destination, 
                        amountPaid: finalAmount
                    });
                    
                    alert("Payment Successful! Booking Confirmed.");
                    closeBookingModal();
                    handleSearch({ preventDefault: () => {} }); 
                } catch (bookingErr) {
                    alert("Payment successful but booking failed. Contact support.");
                    console.error(bookingErr);
                }
            },
            prefill: {
                name: localStorage.getItem('username') || "Passenger",
                contact: "9999999999" // fetch real phone from user profile
            },
            theme: {
                color: "#3399cc"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
            alert("Payment Failed: " + response.error.description);
        });
        
        rzp1.open();

    } catch (err) {
        console.error("Payment Init Error:", err);
        alert("Failed to initiate payment: " + (err.response?.data || "Unknown error"));
    } finally {
        setIsBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-page))] flex flex-col transition-colors">
      <Navbar />

      <div className="max-w-5xl mx-auto w-full px-6 pt-32 pb-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[rgb(var(--color-txt-main))] mb-2">Find your next journey</h1>
          <p className="text-[rgb(var(--color-txt-dim))]">Search for rides shared by our community</p>
        </div>

        
        <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl p-8 shadow-xl mb-12 relative transition-colors">
          <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
             <div className="lg:col-span-5 relative">
              <div className="route-line hidden md:block"></div>
              <div className="space-y-4">
                <div className="relative z-10">
                  <div className="absolute left-3 top-3.5 w-4 h-4 rounded-full border-[3px] border-brand-blue bg-[rgb(var(--color-card))]" />
                  <input
                    name="source"
                    value={searchParams.source}
                    onChange={handleChange}
                    placeholder="Leaving from..."
                    required
                    className="w-full bg-[rgb(var(--color-page))] border-0 rounded-lg pl-10 pr-4 py-3 text-[rgb(var(--color-txt-main))] font-medium focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                </div>
                <div className="relative z-10">
                  <div className="absolute left-3 top-3.5 w-4 h-4 border-[3px] border-brand-purple bg-[rgb(var(--color-card))]" />
                  <input
                    name="destination"
                    value={searchParams.destination}
                    onChange={handleChange}
                    placeholder="Going to..."
                    required
                    className="w-full bg-[rgb(var(--color-page))] border-0 rounded-lg pl-10 pr-4 py-3 text-[rgb(var(--color-txt-main))] font-medium focus:ring-2 focus:ring-brand-purple/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="relative">
                <Calendar className="absolute left-4 top-3.5 text-[rgb(var(--color-txt-main))]" size={20} />
                <input
                  name="date"
                  type="date"
                  value={searchParams.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-[rgb(var(--color-page))] border-0 rounded-lg pl-12 pr-4 py-3 text-[rgb(var(--color-txt-main))] font-medium focus:ring-2 focus:ring-brand-blue/20 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-600/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                
                {isLoading ? (
                  <Loader2 className="animate-spin text-white" size={20} />
                ) : (
                  <>
                    <Search size={20} className="text-white" />
                    <span className="text-white">Find Ride</span>
                  </>
                )}

              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {message && <p className="text-center text-[rgb(var(--color-txt-dim))]">{message}</p>}

          {rides.map((ride) => (
            <div key={ride.id} className="group bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 hover:border-brand-purple/40 rounded-xl p-6 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Ride Info Section */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-white/5 rounded-lg border border-[rgb(var(--color-txt-muted))]/20">
                  <span className="text-lg font-bold text-[rgb(var(--color-txt-main))]">{ride.time ? ride.time.substring(0, 5) : "--:--"}</span>
                  <span className="text-xs text-[rgb(var(--color-txt-dim))] uppercase">Departs</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-[rgb(var(--color-txt-main))]">
                    <span>{ride.source}</span>
                    <span className="text-[rgb(var(--color-txt-dim))]">→</span>
                    <span>{ride.destination}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-[rgb(var(--color-txt-dim))]">

                    <button
                      onClick={() => setViewDriver(ride)}
                      className="flex items-center gap-1 hover:text-brand-blue hover:underline transition-all font-medium"
                    >
                      <User size={14} /> {ride.driverName}
                    </button>

                    <div className="flex items-center gap-1"><Car size={14} /> {ride.availableSeats} seats left</div>
                  </div>
                </div>
              </div>

              
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                 <div className="text-right">
                    
                    {ride.pricePerKm && (
                        <>
                            <div className="text-xl font-bold text-brand-blue">₹{ride.pricePerKm}</div>
                            <div className="text-xs text-[rgb(var(--color-txt-dim))]">per km</div>
                        </>
                    )}
                    
                    {!ride.pricePerKm && ride.price && (
                        <>
                            <div className="text-xl font-bold text-brand-blue">₹{ride.price}</div>
                            <div className="text-xs text-[rgb(var(--color-txt-dim))]">fixed price</div>
                        </>
                    )}
                 </div>

                <button
                    onClick={() => openBookingModal(ride)}
                    disabled={ride.availableSeats === 0}
                    className="px-6 py-3 rounded-full
                              bg-white text-black border border-black/20
                              hover:bg-black hover:text-white
                              transition-all duration-300
                              disabled:opacity-50
                              flex items-center justify-center gap-2"
                >
                    {ride.availableSeats === 0 ? "Full" : "Book Seat"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      {viewDriver && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setViewDriver(null)}
          />

          <div className="relative w-full max-w-sm bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

            
            <div className="bg-brand-blue/10 p-6 flex flex-col items-center justify-center border-b border-brand-blue/10 relative">
              <button
                onClick={() => setViewDriver(null)}
                className="absolute top-4 right-4 text-[rgb(var(--color-txt-dim))] hover:text-[rgb(var(--color-txt-main))]"
              >
                <X size={20} />
              </button>

              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-brand-blue shadow-lg mb-3">
                <User size={40} />
              </div>

              <h3 className="text-xl font-bold text-[rgb(var(--color-txt-main))]">
                {viewDriver.driverName}
              </h3>

              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full mt-1">
                <span>✔</span> VERIFIED DRIVER
              </div>
            </div>

            
            <div className="p-6 space-y-4">

              {/* Vehicle Info */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-[rgb(var(--color-page))] border border-[rgb(var(--color-txt-muted))]/20">
                <div className="p-2 bg-brand-purple/10 text-brand-purple rounded-lg">
                  <Car size={20} />
                </div>
                <div>
                  <p className="text-xs text-[rgb(var(--color-txt-dim))] uppercase tracking-wider">Vehicle</p>
                  <p className="font-semibold text-[rgb(var(--color-txt-main))]">
                    {viewDriver.vehicleModel || "Unknown Model"}
                  </p>
                  <p className="text-xs text-[rgb(var(--color-txt-dim))]">
                    {viewDriver.vehiclePlate || "No Plate Info"}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-[rgb(var(--color-page))] border border-[rgb(var(--color-txt-muted))]/20">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-[rgb(var(--color-txt-dim))] uppercase tracking-wider">Contact</p>
                  <p className="font-semibold text-[rgb(var(--color-txt-main))]">
                    {viewDriver.driverPhone || "Hidden"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[rgb(var(--color-txt-muted))]/10 text-center">
              <p className="text-xs text-[rgb(var(--color-txt-dim))]">
                Book a seat to view full contact details.
              </p>
            </div>
          </div>
        </div>
      )}


      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeBookingModal} />
          
          <div className="relative w-full max-w-md bg-[rgb(var(--color-card))] border border-[rgb(var(--color-txt-muted))]/20 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[rgb(var(--color-txt-muted))]/10 bg-white/5 flex items-center justify-between">
                <h3 className="text-xl font-bold text-[rgb(var(--color-txt-main))]">Confirm Booking</h3>
                <button onClick={closeBookingModal} className="text-[rgb(var(--color-txt-dim))] hover:text-[rgb(var(--color-txt-main))]"><X size={24} /></button>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between text-sm text-[rgb(var(--color-txt-dim))]">
                    <span>From: <b className="text-[rgb(var(--color-txt-main))]">{selectedRide.source}</b></span>
                    <span>To: <b className="text-[rgb(var(--color-txt-main))]">{selectedRide.destination}</b></span>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-3 text-[rgb(var(--color-txt-muted))] uppercase tracking-wider">Select Seats</label>
                    <div className="flex items-center justify-between bg-[rgb(var(--color-page))] p-2 rounded-xl border border-[rgb(var(--color-txt-muted))]/20">
                        <button onClick={() => updateSeats('decrease')} disabled={seatCount <= 1} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition text-[rgb(var(--color-txt-main))]"><Minus size={18} /></button>
                        <span className="text-xl font-bold text-[rgb(var(--color-txt-main))]">{seatCount}</span>
                        <button onClick={() => updateSeats('increase')} disabled={seatCount >= selectedRide.availableSeats} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition text-[rgb(var(--color-txt-main))]"><Plus size={18} /></button>
                    </div>
                    <p className="text-xs text-center mt-2 text-[rgb(var(--color-txt-dim))]">Max {selectedRide.availableSeats} seats available</p>
                </div>

                
                {selectedRide.pricePerKm && selectedRide.distanceKm && (
                  <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-[rgb(var(--color-txt-dim))]">
                          <span>Calculation:</span>
                          <span>{selectedRide.distanceKm} km × ₹{selectedRide.pricePerKm}/km × {seatCount} seats</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-brand-blue/10 rounded-xl border border-brand-blue/20">
                          <span className="text-brand-blue font-medium">Total Fare</span>
                          <span className="text-2xl font-bold text-brand-blue">
                              ₹{Math.round(selectedRide.pricePerKm * selectedRide.distanceKm * seatCount)}
                          </span>
                      </div>
                  </div>
                )}

                
                {!selectedRide.pricePerKm && selectedRide.price && (
                  <div className="flex items-center justify-between p-4 bg-brand-blue/10 rounded-xl border border-brand-blue/20">
                      <span className="text-brand-blue font-medium">Total Fare</span>
                      <span className="text-2xl font-bold text-brand-blue">
                          ₹{selectedRide.price * seatCount}
                      </span>
                  </div>
                )}
            </div>

            <div className="p-6 pt-0">
                <button
                    onClick={handleConfirmBooking}
                    disabled={isBookingLoading}
                    className="w-full 
                              bg-white 
                              text-brand-purple 
                              font-bold 
                              py-4 
                              rounded-xl
                              border border-brand-purple/30
                              hover:bg-black hover:text-white
                              shadow-lg shadow-brand-purple/20 
                              transition-all 
                              flex items-center justify-center gap-2 
                              disabled:opacity-70"
                    >
                    {isBookingLoading ? <Loader2 className="animate-spin" /> : "Pay & Book"}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}