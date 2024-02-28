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
    <div className="page">
      <div className="main login-container">
        <h2>Log In to your account</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="username"
              name="username"
              onChange={handleChange}
              placeholder="Enter username"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="login-button">
            Log In
          </Button>
          <Form.Text className="text-muted">
            No account? <Link to="/signup">Create One!</Link>
          </Form.Text>
          {error && <div className="error-message">{error}</div>}
        </Form>
      </div>
    </div>
  );
};

export default Login;