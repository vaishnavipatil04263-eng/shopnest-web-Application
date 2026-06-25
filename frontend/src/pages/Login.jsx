import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      setForgotMsg(data.message || 'Reset link sent to your email.');
    } catch (error) {
      setForgotMsg('Something went wrong. Try again.');
    }
  };

  if (forgotMode) {
    return (
      <div className="auth-container">
        <form onSubmit={handleForgotPassword} className="auth-form">
          <h2>Forgot Password</h2>
          <p style={{ color: '#a1a1aa', textAlign: 'center' }}>Enter your email to receive a reset link.</p>
          <input type="email" placeholder="Your Email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
          {forgotMsg && <p style={{ color: '#f97316', textAlign: 'center' }}>{forgotMsg}</p>}
          <button type="submit" className="btn">Send Reset Link</button>
          <p style={{ textAlign: 'center' }}>
            <span className="forgot-link" onClick={() => { setForgotMode(false); setForgotMsg(''); }}>Back to Login</span>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="toggle-eye" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <p style={{ textAlign: 'right', marginTop: '-10px' }}>
          <span className="forgot-link" onClick={() => setForgotMode(true)}>Forgot Password?</span>
        </p>
        <button type="submit" className="btn">Login</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;