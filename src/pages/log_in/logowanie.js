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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userName: ''
  });
  // bledy walidacji dla poszczegolnych pol
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    userName: ''
  });
  // ogolny blad formularza (np. zle dane logowania)
  const [formError, setFormError] = useState('');
  // aktualne zdjecie pokazujace sie na stronie 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  // przenoszenie po zalogowaniu sie na main
  const navigate = useNavigate();

  // efekt do zmiany zdjec co 5 sekund
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // zdjecie znika
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % sliderImages.length); // przelaczanie na nowe zdjecie 
        setFade(true); //pojawianie sie nowego zdjecia
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

  // obsluga zmian w polach formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // czyszczenie bledu gdy uzytkownik zaczyna pisac
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // funkcja walidujaca formularz
  const validate = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      userName: ''
    };

    // walidacja emaila
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is incorrect';
      isValid = false;
    }

    // walidacja hasla (minimum 6 znakow)
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // walidacja nazwy uzytkownika tylko przy rejestracji
    if (activeTab === 'signup' && !formData.userName.trim()) {
      newErrors.userName = 'Username is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // najpierw walidacja
    if (!validate()) {
      return;
    }

    // POBIERA uzytkownikow z LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (activeTab === 'login') {
      // szuka uzytkownika o podanym emailu i hasle
      const foundUser = users.find(
        (user) => user.email === formData.email && user.password === formData.password
      );
      if (foundUser) {
        // udane logowanie czyli zgodne dane
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setFormError('');
        navigate('/main'); // przekierowanie na main
      } else {
        setFormError('Zły login lub hasło');
      }
    } else {
      // sprawdza czy uzytkownik juz istnieje
      const existingUser = users.find((user) => user.email === formData.email);
      if (existingUser) {
        setFormError('Użytkownik już istnieje');
      } else {
        // tworzy nowego uzytkownika
        const newUser = { ...formData };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setFormError('');
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

        {/* slider */}
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

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* POKAZUJE SOE tylko kiedy klikniety SING UP */}
          {activeTab === 'signup' && (
            <label>
              Name <span>*</span>
              <br />
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                placeholder="Enter your Name"
                className={errors.userName ? 'error-input' : ''}
              />
              {/* komunikat bledu dla nazwy uzytkownika */}
              {errors.userName && <span className="error-message">{errors.userName}</span>}
            </label>
          )}

          <label>
            E-mail <span>*</span>
            <br />
            {/* zawsze w kazdym formularzu obsluga przez handleChange */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your E-mail"
              className={errors.email ? 'error-input' : ''}
            />
            {/* komunikat bledu dla emaila */}
            {errors.email && <span className="error-message">{errors.email}</span>}
          </label>

          <label>
            Password <span>*</span>
            <br />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your Password"
              className={errors.password ? 'error-input' : ''}
            />
            {/* komunikat bledu dla hasla */}
            {errors.password && <span className="error-message">{errors.password}</span>}
          </label>




          {/* POKAZUJE sie tylko przy LOGOWANIU */}
          {activeTab === 'login' && (
            <a href="#" className="forgot-password">Forgot password?</a>
          )}

          {/* przycisk logowania i rejestracji -  zalezy co klikniete zmienia tresc buttona */}
          <button type="submit" className="submit-btn">
            {activeTab === 'login' ? 'Log in' : 'Sign Up'}
          </button>

          {/* ogolny blad formularza */}
          {formError && <p className="form-error">{formError}</p>}

          {/* zmiana tekstu w zaleznosci co klikniete */}
          <div className="or-divider">
            ————— Or {activeTab === 'login' ? 'Sign Up' : 'Log in'} with —————
          </div>

          {/* tylko wygladaja nie dzialaja  */}
          <div className="social-buttons">
            <button type="button" className="social-btn">
              <span className="icon">
                <img src={google} alt="google" />
              </span> Google</button>

            <button type="button" className="social-btn">
              <span className="icon">
                <img src={apple} alt="apple" />
              </span> Apple</button>

            <button type="button" className="social-btn">
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