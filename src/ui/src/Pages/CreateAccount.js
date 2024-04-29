import React, { useState } from 'react';
import './CreateAccount.css'; 
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; // Import Axios

const CreateAccount = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // Create an object with user data
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };
    
    // POST request to your backend API endpoint
    axios.post('http://localhost:8080/api/create-account', userData)
      .then((res) => {
        console.log('User account created successfully:', res.data);
        // Reset form after successful creation
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        navigate('/overview');
      })
      .catch((error) => {
        console.error('Error creating user account:', error);
        // Handle error if necessary
      });
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
      <div className="create-account-container">
        <div className="signup-form">
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
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
            <button type="submit" className="signup-btn">
              Create Account
            </button>
          </form>
          <Link to="/">
            <button className="back-to-login-btn">Back to Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;