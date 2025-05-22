import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './logowanie.css';
import noprosze from '../../images/noprosze.jpg';
import noprosze1 from '../../images/noprosze1.jpg';
import noprosze2 from '../../images/noprosze2.jpg';
import noprosze3 from '../../images/noprosze3.jpg';
import google from '../../icons/google.png';
import apple from '../../icons/apple.png'; 
import facebook from '../../icons/facebook.png'; 

const sliderImages = [
  noprosze,
  noprosze1,
  noprosze2,
  noprosze3
];

function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // zacznij fade out
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % sliderImages.length);
        setFade(true); // fade in nowego slajdu
      }, 400); // czas trwania fade
    }, 5000); // co 5 sekund zmiana

    return () => clearInterval(interval);
  }, []);
  
  const goToSlide = (index) => {
    if(index === currentSlide) return;
    setFade(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(true);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (activeTab === 'login') {
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
    } else {
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

        {/* Formularz wspólny */}
        <form onSubmit={handleSubmit} className="login-form">
          {activeTab === 'signup' && (
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
          )}

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

          {activeTab === 'login' && (
            <a href="#" className="forgot-password">Forgot password?</a>
          )}

          <button type="submit" className="submit-btn">
            {activeTab === 'login' ? 'Log in' : 'Sign Up'}
          </button>

          {error && <p className="error">{error}</p>}

          <div className="or-divider">
            ————— Or {activeTab === 'login' ? 'Sign Up' : 'Log in'} with —————
          </div>

          <div className="social-buttons">
            <button className="social-btn">
              <span className="icon">
                <img src={google} alt="google" />
              </span> Google</button>

            <button className="social-btn">
              <span className="icon">
                <img src={apple} alt="apple" />
              </span> Apple</button>

            <button className="social-btn">
              <span className="icon">
                <img src={facebook} alt="facebook" />
              </span> Facebook</button>

          </div>

          <div className="legal">
            By continuing, you agree to SnapSolve{' '}
            <a href="#"><b>Terms of Service</b></a><br />
            and <a href="#"><b>Privacy Policy</b></a>
          </div>
        </form>
      </div>

      {/* Sekcja ze sliderem zdjęć i paskami */}
      <div className="login-image-section">
        <img
          src={sliderImages[currentSlide]}
          alt={`slide-${currentSlide}`}
          className={`slider-image ${fade ? 'fade-in' : 'fade-out'}`}
        />
        <div className="slider-indicators">
          {sliderImages.map((_, i) => (
            <span
              key={i}
              className={`bar ${currentSlide === i ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Auth;
