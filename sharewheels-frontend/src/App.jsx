import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';
import RegisterVehicle from './pages/RegisterVehicle';
import PostRide from './pages/PostRide';
import FindRide from './pages/FindRide';
import MyBookings from './pages/MyBookings';
import MyRides from './pages/MyRides';
import PrivateRoute from './components/PrivateRoute';

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
    </>
  );
}

function App() {
  return (
    <Router>
      
      <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))] transition-colors duration-300">

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />

          <Route
            path="/register-vehicle"
            element={<PrivateRoute><RegisterVehicle /></PrivateRoute>}
          />

          <Route
            path="/post-ride"
            element={<PrivateRoute><PostRide /></PrivateRoute>}
          />

          <Route
            path="/find-ride"
            element={<PrivateRoute><FindRide /></PrivateRoute>}
          />

          <Route
            path="/my-bookings"
            element={<PrivateRoute><MyBookings /></PrivateRoute>}
          />

          <Route
            path="/my-rides"
            element={<PrivateRoute><MyRides /></PrivateRoute>}
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
