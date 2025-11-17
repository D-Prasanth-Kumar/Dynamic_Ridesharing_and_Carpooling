import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <div style={{ padding: "20px" }}>

      <h1>Ride Sharing App</h1>

      <nav style={{ marginBottom: "20px" }}>
        <Link to="/register" style={{ marginRight: "10px" }}>Register</Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

    </div>
  );
}

export default App;
