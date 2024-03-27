import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import getUserInfo from "../../utilities/decodeJwt";


const Login = () => {
  const [data, setData] = useState({ usename: "", password: "" });
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserInfo();
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = ({ target: { name, value } }) => {
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(`${backendUrl}/user/login`, data);
      localStorage.setItem("accessToken", res.accessToken);
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-header">Log In</div>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-container">
          <div className="form-group">
            <input
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Username"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className="form-control"
              required
            />
          </div>
        </div>
        <button type="submit" className="login-button">
          Log In
        </button>
        <div className="text-muted">
          No account? <Link to="/signup" className="signup-link">Create One!</Link>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Login;