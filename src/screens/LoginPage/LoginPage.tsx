import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handles form submission and authentication logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setError('Please enter both name and email.');
      return;
    }

    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        credentials: 'include', // include cookie in request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      if (response.ok) {
        navigate('/search'); // redirect after successful login
      } else {
        setError('Login failed. Please check your name and email.');
      }
    } catch (error) {
      console.error('Login request error:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="login-page-container">
      <h1 className="main-title">Find Your Perfect Puppy 🐶</h1>

      <div className="login-form-container">
        <h2 className="section-title">Sign in to Fetch Dogs</h2>

        <form className="login-form" onSubmit={handleLogin} autoComplete="off">
          <div className="input-group">
            <div className="input-wrapper">
              {/* Hidden label for accessibility */}
              <label htmlFor="name" className="visually-hidden">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>
            <div className="input-wrapper">
              {/* Hidden label for accessibility */}
              <label htmlFor="email" className="visually-hidden">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>
          </div>

          <button type="submit" className="login-button">Login</button>

          {/* Show error message when login fails */}
          {error && <p id="login-error" className="error-message">{error}</p>}
        </form>

        <p className="login-explanation">
          Enter your name and email to log in automatically. 
          No separate sign-up or password is required.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
