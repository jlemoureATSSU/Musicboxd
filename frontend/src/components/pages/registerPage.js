import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Register = () => {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(`${backendUrl}/user/signup`, data);
      const {accessToken} = res;
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="page">
      <div className="main login-container">
        <h2>Sign Up</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Control
              type="text"
              name="username"
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="login-button">
            Sign Up
                </Button>
              </Form>
            </div>
          </div>
        );
      }

export default Register;
