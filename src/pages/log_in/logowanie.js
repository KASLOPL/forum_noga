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
  // ktore dzialanie aktywne login czy sign up
  const [activeTab, setActiveTab] = useState('login');
  // przechowuje dane wpisane przez urzytkownika w formularzu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  // bledy wpisania 
  const [error, setError] = useState('');
  // aktualne zdjecie pokazujace sie na stronie 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  // przenoszenie po zalogowaniu sie na main
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // zdjecie znika
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % sliderImages.length); // przelaczanie na nowe zdjecie 
        // setFade(true); pojawianie sie nowego zdjecia
      }, 400); // po 400 ms
    }, 5000); // co 5 sekund zmiana zdjecia !!

    return () => clearInterval(interval);
  }, []);
  
  // klikniecie w jeden z paskow pod zdjeciami zmienia je
  const goToSlide = (index) => {
    if(index === currentSlide) return; // ten sam obraz nic sie nie dzieje
    setFade(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(true);
    }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // POBIERA uzytkownikow z LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (activeTab === 'login') {
      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );
      if (foundUser) {
        // udane logowanie czyli zgodne dane
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setError('');
        navigate('/main'); // przekierowanie na main
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
          {/* pokazywne tylko kiedy klikniety sign up */}
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
            {/* zawsze w kazdym formularzu - obsluga przez OnChange */}
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

          {/* pokazuje sie tylko przy logowaniu */}
          {activeTab === 'login' && (
            <a href="#" className="forgot-password">Forgot password?</a>
          )}

          {/* przycisk logowania i rejestracji -  zalezy co klikniete zmienia tresc buttona */}
          <button type="submit" className="submit-btn">
            {activeTab === 'login' ? 'Log in' : 'Sign Up'}
          </button>

          {error && <p className="error">{error}</p>}

          {/* zmiana tekstu w zaleznosci co klikniete */}
          <div className="or-divider">
            ————— Or {activeTab === 'login' ? 'Sign Up' : 'Log in'} with —————
          </div>

          {/* tylko wygladaja nie dzialaja  */}
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
          // fade to animacja css 
          className={`slider-image ${fade ? 'fade-in' : 'fade-out'}`}
        />
        {/* paski pod zdjeciami zmiana jesli klikniety nie jest active -  goToSlide(i) */}
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
