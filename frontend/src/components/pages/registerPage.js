import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/user/signup`, data);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-header">Sign Up</div>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="login-container-required">
          <div className="form-group">
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Username"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              placeholder="First Name"
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="form-control"
            />
          </div>
        </div>

        <div className="login-container-optional">
          <div className="optional">Optional</div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="phoneNumber"
              onChange={handleChange}
              placeholder="Phone Number"
              className="form-control"
            />
          </div>
        </div>
        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Register;
