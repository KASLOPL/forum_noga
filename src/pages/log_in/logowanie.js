import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  updateProfile 
} from "firebase/auth";
import { auth } from "../../firebase.js";
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 DEBUGGING FIREBASE - sprawdź czy działa
  useEffect(() => {
    console.log('🔥 === DEBUGGING FIREBASE ===');
    console.log('Auth object:', auth);
    console.log('Auth app:', auth?.app);
    console.log('Auth app name:', auth?.app?.name);
    
    if (!auth) {
      console.error('❌ BŁĄD: Auth jest undefined!');
      setFormError('Błąd: Firebase nie został zainicjalizowany. Sprawdź plik firebase.js');
      return;
    }
    
    if (!auth.app) {
      console.error('❌ BŁĄD: Firebase app nie został zainicjalizowany!');
      setFormError('Błąd: Firebase app nie działa. Sprawdź konfigurację w firebase.js');
      return;
    }
    
    console.log('✅ Firebase działa prawidłowo!');
  }, []);

  // Sprawdzenie czy użytkownik jest już zalogowany
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ User logged in:', user.email);
        navigate('/main');
      } else {
        console.log('👤 User not logged in');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Efekt do zmiany zdjęć co 5 sekund
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
    
    // Czyszczenie błędu gdy użytkownik zaczyna pisać
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

    // Walidacja emaila
    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format emaila';
      isValid = false;
    }

    // Walidacja hasła
    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków';
      isValid = false;
    }

    // Walidacja nazwy użytkownika tylko przy rejestracji
    if (activeTab === 'signup' && !formData.userName.trim()) {
      newErrors.userName = 'Nazwa użytkownika jest wymagana';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 === PRÓBA LOGOWANIA ===');
    console.log('Email:', formData.email);
    console.log('Password length:', formData.password.length);
    console.log('Active tab:', activeTab);

    // Sprawdź czy Firebase działa
    if (!auth || !auth.app) {
      console.error('❌ Firebase nie jest skonfigurowany!');
      setFormError('Błąd konfiguracji Firebase. Sprawdź plik firebase.js');
      return;
    }

    if (!validate()) {
      console.log('❌ Validation failed');
      return;
    }

    setIsLoading(true);
    setFormError('');

    try {
      if (activeTab === 'login') {
        console.log('🔐 Attempting login...');
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('✅ Login successful:', userCredential.user.email);
      } else {
        console.log('📝 Attempting signup...');
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('✅ Signup successful:', userCredential.user.email);
        
        // Dodaj nazwę użytkownika do profilu
        if (formData.userName.trim()) {
          try {
            await updateProfile(userCredential.user, { 
              displayName: formData.userName.trim() 
            });
            console.log('✅ Profile updated with displayName:', formData.userName);
          } catch (profileError) {
            console.warn('⚠️ Failed to update profile:', profileError);
          }
        }
      }
      
      // onAuthStateChanged automatycznie przekieruje użytkownika
    } catch (error) {
      console.error('❌ Authentication error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Szczegółowa obsługa błędów
      switch (error.code) {
        case 'auth/user-not-found':
          setFormError('❌ Nie znaleziono użytkownika z tym adresem email');
          break;
        case 'auth/wrong-password':
          setFormError('❌ Nieprawidłowe hasło');
          break;
        case 'auth/invalid-credential':
          setFormError('❌ Nieprawidłowe dane logowania');
          break;
        case 'auth/email-already-in-use':
          setFormError('❌ Użytkownik z tym emailem już istnieje');
          break;
        case 'auth/weak-password':
          setFormError('❌ Hasło jest za słabe - użyj co najmniej 6 znaków');
          break;
        case 'auth/invalid-email':
          setFormError('❌ Nieprawidłowy format emaila');
          break;
        case 'auth/too-many-requests':
          setFormError('❌ Za dużo prób logowania. Spróbuj ponownie później');
          break;
        case 'auth/network-request-failed':
          setFormError('❌ Błąd połączenia. Sprawdź internet');
          break;
        case 'auth/configuration-not-found':
          setFormError('❌ BŁĄD KONFIGURACJI: Sprawdź firebase.js i Firebase Console');
          break;
        case 'auth/api-key-not-valid':
          setFormError('❌ Nieprawidłowy API Key w konfiguracji Firebase');
          break;
        case 'auth/project-not-found':
          setFormError('❌ Projekt Firebase nie istnieje');
          break;
        default:
          setFormError(`❌ Nieznany błąd: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcja do zmiany taba z czyszczeniem formularza
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormError('');
    setErrors({ email: '', password: '', userName: '' });
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <h1>Welcome to Snapsolve!</h1>
        <div className="colorrr">
          <p>Connect with experts, ask questions, and get reliable answers in no time.</p>
        </div>

        {/* Slider */}
        <div className="tab-switch">
          <div className={`slider ${activeTab === 'login' ? 'right' : 'left'}`} />
          <div
            className={`tab-option ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabChange('signup')}
          >
            Sign Up
          </div>
          <div
            className={`tab-option ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
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
                disabled={isLoading}
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
              disabled={isLoading}
              autoComplete="email"
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
              disabled={isLoading}
              autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </label>

          {activeTab === 'login' && (
            <a href="#" className="forgot-password">Forgot password?</a>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? '⏳ Ładowanie...' : (activeTab === 'login' ? '🔐 Zaloguj się' : '📝 Zarejestruj się')}
          </button>

          {formError && <p className="form-error" style={{color: 'red', fontWeight: 'bold'}}>{formError}</p>}

          <div className="or-divider">
            ————— Or {activeTab === 'login' ? 'Sign Up' : 'Log in'} with —————
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn" disabled={isLoading}>
              <span className="icon">
                <img src={google} alt="google" />
              </span> Google
            </button>

            <button type="button" className="social-btn" disabled={isLoading}>
              <span className="icon">
                <img src={apple} alt="apple" />
              </span> Apple
            </button>

            <button type="button" className="social-btn" disabled={isLoading}>
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