import { useState } from "react";
import axiosClient from "../api/axiosClient";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "DRIVER"
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/api/auth/register", formData);
      setResponseMessage(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResponseMessage(JSON.stringify(error.response?.data || error.message, null, 2));
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
        /><br /><br />

        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
        /><br /><br />

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        /><br /><br />

        <input
          type="text"
          name="phone"
          placeholder="Enter phone"
          value={formData.phone}
          onChange={handleChange}
        /><br /><br />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        /><br /><br />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="DRIVER">Driver</option>
          <option value="PASSENGER">Passenger</option>
        </select><br /><br />

        <button type="submit">Register</button>
      </form>

      <pre style={{ marginTop: "20px", color: "green" }}>
        {responseMessage}
      </pre>
    </div>
  );
}

export default Register;
