import React, { useState, useEffect } from 'react' //react i hooki
import { useNavigate } from 'react-router-dom' // nawigacje z react routera
import { auth } from '../../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth' // funkcje do logowania i rejestracji z firebase
import './logowanie.css' 
import noprosze from '../../images/noprosze.jpg' // obrazki do slidera
import noprosze1 from '../../images/noprosze1.jpg'
import noprosze2 from '../../images/noprosze2.jpg'
import noprosze3 from '../../images/noprosze3.jpg'
import google from '../../icons/google.png' // import ikon social media
import apple from '../../icons/apple.png'
import facebook from '../../icons/facebook.png'
import { db } from '../../firebase'; // <-- TO DODAJ
import { doc, setDoc, getDoc } from 'firebase/firestore'; // <-- I TO

// tu wszystkie obrazki do slidera
const sliderImages = [
  noprosze,
  noprosze1,
  noprosze2,
  noprosze3
]

function Auth() {
  // info czy jest aktywna zakladka logowania czy rejestracji
  const [activeTab, setActiveTab] = useState('login')

  // dane wpisane w formularzu
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userName: ''
  })

  // ledy do walidacji formularza
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    userName: ''
  })

  const [formError, setFormError] = useState('') // ogolny blad z formularza
  const [currentSlide, setCurrentSlide] = useState(0) // numer aktualnego slajdu
  const [fade, setFade] = useState(true) // stan do animacji slajdów
  const [isSubmitting, setIsSubmitting] = useState(false) // sprawdza czy formularz juz sie wysyla
  const navigate = useNavigate() // hook do przekierowywania uzytkownika

  // kiedy komponent sie zaladuje to sprawdzamy czy user juz zalogowany
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') // bierzemy dane z localStorage
    if (isLoggedIn === 'true') {
      navigate('/main', { replace: true }) // jesli tak to przekierowujemy na strone glowna
    }
  }, [navigate])

  // automatyczna zmiana slajdow co 5 sekund
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false) // efekt znikania
      setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % sliderImages.length) // zmieniamy na kolejny slajd
        setFade(true) //efekt pojawiania
      }, 400)
    }, 5000)

    return () => clearInterval(interval) // czysc interwal jak komponent sie zamknie
  }, [])

  // reczna zmiana slajdu przez klikniecie
  const goToSlide = (index) => {
    if(index === currentSlide) return // jesli klikniemy na ten sam slajd to nic nie robimy
    setFade(false) // efekt znikania
    setTimeout(() => {
      setCurrentSlide(index) // ustawiamy wybrany slajd
      setFade(true) // efekt pojawiania
    }, 400)
  }

  // obsluga zmian w polach formularza
  const handleChange = (e) => {
    const { name, value } = e.target // bierzemy nazwe i wartosc z inputa
    setFormData(prev => ({
      ...prev,
      [name]: value // ustawienie nowej wartosci
    }))

    // jak byl blad to go usuwamy
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // czyscimy ogolny blad
    if (formError) {
      setFormError('')
    }
  }

  // walidacja danych w formularzu
  const validate = () => {
    let isValid = true
    const newErrors = {
      email: '',
      password: '',
      userName: ''
    }

    // sprawdzamy email
    if (!formData.email.trim()) { // sprawdzamy czy email nie jest pusty
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) { // sprawdzenie formatu emaila
      newErrors.email = 'Email is incorrect'
      isValid = false
    }

    // sprawdzamy haslo
    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false // jesli haslo puste to blad
    } else if (formData.password.length < 6) { // sprawdzamy czy ma min 6 znakow
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    // sprawdzamy nazwe uzytkownika przy rejestracji
    if (activeTab === 'signup' && !formData.userName.trim()) { // jesli rejestracja i nazwa pusta
      newErrors.userName = 'Username is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid // zwracamy czy wszystko ok
  }

  // co sie dzieje po kliknieciu przycisku formularza
  const handleSubmit = async (e) => { // obsluga submitu formularza
    e.preventDefault() // zatrzymujemy domyslne wysylanie formularza

    if (isSubmitting) return // jesli juz sie wysyla to nie rob nic

    if (!validate()) {
      return // jesli walidacja zla to nie wysylamy
    }

    setIsSubmitting(true) // blokujemy ponowne wyslanie
    setFormError('') // czyscimy blad

    try {
      if (activeTab === 'login') {
        // logowanie uzytkownika
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password) // logowanie przez firebase
        const user = userCredential.user // pobieramy dane uzytkownika
        
        async function fetchUserData(uid) {
              try {
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                  const userData = docSnap.data();
                  console.log("Dane użytkownika:", userData);
                  return userData;
                } else {
                  console.log("Nie znaleziono dokumentu użytkownika");
                  return null;
                }
              } catch (error) {
                console.error("Błąd podczas pobierania danych:", error);
                return null;
              }
            }
            const userProfileData =  fetchUserData(user.uid);

        const userData = {
          uid: user.uid, // unikalny identyfikator uzytkownika
          email: user.email, // email uzytkownika
          userName: user.displayName || user.email.split('@')[0], // domyslna nazwa jak nie ma displayName
          bio: userProfileData?.bio || '',
          school: userProfileData?.school || '',
          fieldOfStudy: userProfileData?.fieldOfStudy || '',
          interests: userProfileData?.interests || ''
        }

        localStorage.setItem('isLoggedIn', 'true') // zapisujemy info o logowaniu
        localStorage.setItem('currentUser', JSON.stringify(userData)) // zapisujemy dane uzytkownika

        navigate('/main', { replace: true }) // przekierowanie
      } else {
        // rejestracja nowego uzytkownika
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password) // rejestracja przez firebase
        const user = userCredential.user // pobieramy dane uzytkownika

        // ustawiamy nazwe uzytkownika
        if (formData.userName.trim()) {
          await updateProfile(user, { displayName: formData.userName.trim() }) // aktualizacja profilu uzytkownika
        }

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          userName: formData.userName.trim(),
          school: "",
          fieldOfStudy: "",
          bio: "",
          interests: ""
          });

        const userData = {
          uid: user.uid, // unikalny identyfikator uzytkownika
          email: user.email, // email uzytkownika
          userName: formData.userName.trim() || user.email.split('@')[0], // domyslna nazwa jak nie ma displayName
          bio: '',
          school: '',
          fieldOfStudy: '',
          interests: ""
        }

        localStorage.setItem('isLoggedIn', 'true') // zapisujemy logowanie
        localStorage.setItem('currentUser', JSON.stringify(userData)) // zapisujemy dane uzytkownika

        navigate('/main', { replace: true }) // przekierowanie
      }
    } catch (error) {
      console.error('Auth error:', error) // logujemy blad

      // rozne komunikaty zalezne od bledu
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') { // bledne dane logowania
        setFormError('Zly login lub haslo')
      } else if (error.code === 'auth/email-already-in-use') { // email juz istnieje
        setFormError('Uzytkownik juz istnieje')
      } else if (error.code === 'auth/weak-password') { // haslo za slabe
        setFormError('Haslo jest za slabe')
      } else {
        setFormError('Wystapil blad sprobuj ponownie')
      }
    } finally {
      setIsSubmitting(false) // odblokowujemy formularz
    }
  }

  return (
    <div className="login-container">
      {/* Sekcja formularza */}
      <div className="login-form-section">
        <h1>Welcome to Snapsolve!</h1>
        <div className="colorrr">
          <p>Connect with experts, ask questions, and get reliable answers in no time.</p>
        </div>

        {/* Przełącznik między logowaniem a rejestracją */}
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

        {/* Formularz */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Pole nazwy użytkownika (tylko przy rejestracji) */}
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
              {errors.userName && <span className="error-message">{errors.userName}</span>} {/* wyswietlanie bledu dla nazwy użytkownika*/}
            </label>
          )}

          {/* Pole email */}
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

          {/* Pole hasła */}
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

          {/* Link do resetu hasla (tylko przy logowaniu) */}
          {activeTab === 'login' && (
            <a href="#" className="forgot-password">Forgot password?</a>
          )}

          {/* Przycisk submit */}
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Loading...' : (activeTab === 'login' ? 'Log in' : 'Sign Up')}
          </button>

          {/* Wyswietlanie ogolnego bledu formularza */}
          {formError && <p className="form-error">{formError}</p>}

          {/* Separator dla logowania przez social media */}
          <div className="or-divider">
            ————— Or {activeTab === 'login' ? 'Sign Up' : 'Log in'} with —————
          </div>

          {/* Przyciski social media */}
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

          {/* Informacje prawne */}
          <div className="legal">
            By continuing, you agree to SnapSolve{' '}
            <a href="#"><b>Terms of Service</b></a><br />
            and <a href="#"><b>Privacy Policy</b></a>
          </div>
        </form>
      </div>

      {/* Sekcja ze sliderem zdjec */}
      <div className="login-image-section">
        <img
          src={sliderImages[currentSlide]}
          alt={`slide-${currentSlide}`}
          className={`slider-image ${fade ? 'fade-in' : 'fade-out'}`} // animacja slajdu
        />
        {/* Wskazniki slajdow */}
        <div className="slider-indicators">
          {sliderImages.map((_, i) => ( // iteracja po wszystkich obrazkach w sliderze
            <span
              key={i} // unikalny klucz dla kazdego wskaznika
              className={`bar ${currentSlide === i ? 'active' : ''}`} // aktywna klasa dla aktualnego slajdu
              onClick={() => goToSlide(i)} // zmiana slajdu po kliknieciu
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Auth;