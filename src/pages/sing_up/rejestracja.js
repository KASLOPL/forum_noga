import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './rejestracja.css';
import noprosze from '../../images/noprosze.jpg';

function Rejestracja() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setError('');
      navigate('/main');
    } else {
      setError('Zły login lub hasło');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      setError('Użytkownik już istnieje');
    } else {
      const newUser = { email, password, userName };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setError('');
      navigate('/main');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <h1>Welcome to Snapsolve!</h1>
        <div className="colorrr">
          <p>Connect with experts, ask questions, and get reliable answers in no time.</p>
        </div>

        {/* Zakładki */}
        <div className="tab-switch">
          <div className={`slider ${activeTab === 'login' ? 'right' : 'left'}`} />
          <div
            className={`tab-option ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </div>
          <div
            className={`tab-option ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Log in
          </div>
        </div>
        {/* Rejestracja */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="login-form">
            <label>
              Name <span>*</span>
              <br />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder="Enter your Name"
              />
            </label>

            <label>
              E-mail <span>*</span>
              <br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your E-mail"
              />
            </label>

            <label>
              Password <span>*</span>
              <br />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your Password"
              />
            </label>

            <button type="submit" className="submit-btn">Sign Up</button>
          </form>
        )}

        {error && <p className="error">{error}</p>}

        <div className="or-divider">
          ————————— Or {activeTab === 'login' ? 'Sign Up' : 'Log in'} with —————————
        </div>

        {/* Tutaj możesz wkleić social buttons bez SVG */}
        <div className="social-buttons">
          <button className="social-btn">
            <span className="icon">🔵</span>
            Google
          </button>
          <button className="social-btn">
            <span className="icon">🍎</span>
            Apple
          </button>
          <button className="social-btn">
            <span className="icon">📘</span>
            Facebook
          </button>
        </div>

        <div className="legal">
          By continuing, you agree to SnapSolve{' '}
          <a href="#"><b>Terms of Service</b></a><br />
          and <a href="#"><b>Privacy Policy</b></a>
        </div>
      </div>

      <div className="login-image-section">
        <img src={noprosze} alt="Login" />
      </div>
    </div>
  );
}

export default Rejestracja;
