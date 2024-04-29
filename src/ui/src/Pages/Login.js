import React, { useState} from 'react';
import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 

  const navigate = useNavigate(); // Initialize useHistory for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to your backend API for login
      const response = await axios.post('http://localhost:8080/api/login', { email, password });

      if (response.status === 200) {
        // Login successful, route to the next page (e.g., overview)
        navigate('/overview');
      } else {
        // Handle login error (e.g., display error message)
        console.error('Login error:', response.data.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };



  return (
    <div>
      <div className="loginheader-container">
        <header className="App-header">
          <div className="logo-container">
            <img
              src="./images/capitalonelogo.png"
              alt="capital one logo"
              className="logo"
            />
            <h1 className="header-title">Health Dashboard</h1>
          </div>
        </header>
      </div>
      <div className="login-container">
        <div className="signin-form">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
              <button type="submit" className="signin-btn">
                Sign In
              </button>
          </form>
          <Link to="/createaccount">
            <button className="create-account-btn">Create Account</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
