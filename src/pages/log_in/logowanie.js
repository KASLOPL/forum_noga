import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../firebase';
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userName: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    userName: ''
  });
  const [formError, setFormError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Dodane: zapobieganie wielokrotnym kliknięciom
  const navigate = useNavigate();

  // Sprawdzenie czy użytkownik już jest zalogowany
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/main', { replace: true }); // replace: true zapobiega powrotowi
    }
  }, [navigate]);

  // Efekt do zmiany zdjęć
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % sliderImages.length);
        setFade(true);
      }, 400);
    }, 5000);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Czyszczenie ogólnego błędu formularza
    if (formError) {
      setFormError('');
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
      userName: ''
    };

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is incorrect';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (activeTab === 'signup' && !formData.userName.trim()) {
      newErrors.userName = 'Username is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Zapobieganie wielokrotnym kliknięciom
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      if (activeTab === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        const userData = {
          uid: user.uid,
          email: user.email,
          userName: user.displayName || user.email.split('@')[0]
        };
        
        // WAŻNE: Ustawianie obu wartości w localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Przekierowanie z replace: true
        navigate('/main', { replace: true });
        
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        if (formData.userName.trim()) {
          await updateProfile(user, { displayName: formData.userName.trim() });
        }
        
        const userData = {
          uid: user.uid,
          email: user.email,
          userName: formData.userName.trim() || user.email.split('@')[0]
        };
        
        // WAŻNE: Ustawianie obu wartości w localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Przekierowanie z replace: true
        navigate('/main', { replace: true });
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setFormError('Zły login lub hasło');
      } else if (error.code === 'auth/email-already-in-use') {
        setFormError('Użytkownik już istnieje');
      } else if (error.code === 'auth/weak-password') {
        setFormError('Hasło jest za słabe');
      } else {
        setFormError('Wystąpił błąd. Spróbuj ponownie.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <h1>Welcome to Snapsolve!</h1>
        <div className="colorrr">
          <p>Connect with experts, ask questions, and get reliable answers in no time.</p>
        </div>

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

        <form onSubmit={handleSubmit} className="login-form" noValidate>
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
                disabled={isSubmitting}
              />
              {errors.userName && <span className="error-message">{errors.userName}</span>}
            </label>
          )}

          <label>
            E-mail <span>*</span>
            <br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your E-mail"
              className={errors.email ? 'error-input' : ''}
              disabled={isSubmitting}
            />
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
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </label>

          {activeTab === 'login' && (
            <a href="#" className="forgot-password">Forgot password?</a>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : (activeTab === 'login' ? 'Log in' : 'Sign Up')}
          </button>

          {formError && <p className="form-error">{formError}</p>}

          <div className="or-divider">
            ————— Or {activeTab === 'login' ? 'Sign Up' : 'Log in'} with —————
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn" disabled={isSubmitting}>
              <span className="icon">
                <img src={google} alt="google" />
              </span> Google
            </button>

            <button type="button" className="social-btn" disabled={isSubmitting}>
              <span className="icon">
                <img src={apple} alt="apple" />
              </span> Apple
            </button>

            <button type="button" className="social-btn" disabled={isSubmitting}>
              <span className="icon">
                <img src={facebook} alt="facebook" />
              </span> Facebook
            </button>
          </div>

          <div className="legal">
            By continuing, you agree to SnapSolve{' '}
            <a href="#"><b>Terms of Service</b></a><br />
            and <a href="#"><b>Privacy Policy</b></a>
          </div>
        </form>
      </div>

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