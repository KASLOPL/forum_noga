import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './logowanie.css';
import noprosze from '../../images/noprosze.jpg';

function Logowanie() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const newUser = { email, password };
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
        {/* Suwak zakładek */}
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

        {/* Formularz logowania lub rejestracji */}
        <form
          onSubmit={activeTab === 'login' ? handleLogin : handleSignup}
          className="login-form"
        >
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
            Password<span>*</span>
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
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          )}

          <button type="submit" className="submit-btn">
            {activeTab === 'login' ? 'Log in' : 'Sign Up'}
          </button>

          {error && <p className="error">{error}</p>}

          <div className="or-divider">
            ————————— Or {activeTab === 'login' ? 'Sign Up' : 'Log in'} with —————————
          </div>

          <div className="social-buttons">
            
<div className="social-buttons">
  <button className="social-btn">
    <span className="icon">
      {/* Google SVG */}
      <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_75_217)">
<path d="M8.31448 0.677326C5.81659 1.54387 3.66242 3.18859 2.16837 5.36991C0.674321 7.55123 -0.0808488 10.1542 0.0137819 12.7964C0.108413 15.4386 1.04786 17.9809 2.69412 20.0497C4.34039 22.1186 6.6067 23.605 9.16018 24.2906C11.2303 24.8248 13.3993 24.8482 15.4805 24.359C17.3659 23.9355 19.109 23.0296 20.5391 21.7301C22.0275 20.3362 23.1079 18.563 23.6641 16.6012C24.2686 14.4677 24.3762 12.2241 23.9785 10.0426H12.3535V14.8648H19.086C18.9514 15.6339 18.6631 16.368 18.2382 17.0231C17.8133 17.6782 17.2607 18.2408 16.6133 18.6773C15.7912 19.2211 14.8645 19.587 13.8926 19.7515C12.9179 19.9328 11.9181 19.9328 10.9434 19.7515C9.95547 19.5473 9.02092 19.1395 8.19925 18.5543C6.87922 17.6199 5.88807 16.2924 5.36721 14.7613C4.83756 13.2015 4.83756 11.5105 5.36721 9.95076C5.73797 8.85744 6.35087 7.86197 7.16018 7.03865C8.08634 6.07918 9.25888 5.39334 10.5492 5.05638C11.8394 4.71943 13.1976 4.74438 14.4746 5.1285C15.4722 5.43473 16.3845 5.96978 17.1387 6.691C17.8978 5.93579 18.6556 5.17863 19.4121 4.41951C19.8028 4.01131 20.2285 3.62264 20.6133 3.20467C19.4621 2.13333 18.1107 1.2997 16.6367 0.751545C13.9526 -0.223084 11.0156 -0.249276 8.31448 0.677326Z" fill="white"/>
<path d="M8.31445 0.677299C11.0154 -0.249934 13.9523 -0.224431 16.6367 0.749565C18.111 1.30145 19.4617 2.13909 20.6113 3.21441C20.2207 3.63238 19.8086 4.023 19.4102 4.42925C18.6523 5.18576 17.8952 5.93967 17.1387 6.69097C16.3845 5.96976 15.4722 5.4347 14.4746 5.12847C13.198 4.743 11.8399 4.71661 10.5493 5.05219C9.25863 5.38776 8.08537 6.07234 7.1582 7.03082C6.34889 7.85413 5.73599 8.8496 5.36523 9.94292L1.31641 6.80816C2.76564 3.93425 5.2749 1.73594 8.31445 0.677299Z" fill="#E33629"/>
<path d="M0.242182 9.91357C0.459802 8.83505 0.821095 7.79058 1.3164 6.80811L5.36523 9.95068C4.83557 11.5105 4.83557 13.2015 5.36523 14.7612C4.01627 15.8029 2.66666 16.8498 1.3164 17.9019C0.0764606 15.4337 -0.3017 12.6216 0.242182 9.91357Z" fill="#F8BD00"/>
<path d="M12.3535 10.0405H23.9785C24.3762 12.222 24.2686 14.4657 23.6641 16.5991C23.1079 18.561 22.0275 20.3342 20.5391 21.728C19.2324 20.7085 17.9199 19.6968 16.6133 18.6772C17.2611 18.2403 17.814 17.677 18.2389 17.0213C18.6638 16.3655 18.9519 15.6307 19.086 14.8608H12.3535C12.3516 13.2554 12.3535 11.6479 12.3535 10.0405Z" fill="#587DBD"/>
<path d="M1.31445 17.9019C2.66471 16.8602 4.01432 15.8133 5.36328 14.7612C5.88517 16.2929 6.87774 17.6204 8.19922 18.5542C9.02345 19.1367 9.96002 19.5412 10.9492 19.7417C11.9239 19.9229 12.9237 19.9229 13.8984 19.7417C14.8703 19.5772 15.797 19.2113 16.6191 18.6675C17.9258 19.687 19.2383 20.6987 20.5449 21.7183C19.115 23.0185 17.3719 23.9251 15.4863 24.3491C13.4051 24.8384 11.2362 24.8149 9.16602 24.2808C7.52871 23.8436 5.99937 23.0729 4.67383 22.0171C3.27082 20.9032 2.12491 19.4995 1.31445 17.9019Z" fill="#319F43"/>
</g>
<defs>
<clipPath id="clip0_75_217">
<rect width="25" height="25" fill="white"/>
</clipPath>
</defs>
</svg>

    </span>
    Google
  </button>

  <button className="social-btn">
    <span className="icon">
      {/* Apple SVG */}
      <svg width="18" height="18" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.497 23.0371C16.1401 24.3036 14.6586 24.1036 13.2325 23.5037C11.7233 22.8904 10.3388 22.8638 8.74649 23.5037C6.75269 24.3303 5.70042 24.0903 4.50968 23.0371C-2.24706 16.3313 -1.25017 6.11923 6.4204 5.74594C8.28958 5.83926 9.59108 6.73248 10.6849 6.81247C12.3187 6.49251 13.8833 5.57263 15.6278 5.69261C17.7186 5.85259 19.297 6.65249 20.3354 8.09231C16.0155 10.5853 17.0401 16.0646 21 17.5978C20.2108 19.5975 19.1862 21.5839 17.4832 23.0504L17.497 23.0371ZM10.5464 5.66595C10.3388 2.69299 12.8448 0.23997 15.7248 0C16.1263 3.43957 12.4848 5.99924 10.5464 5.66595Z" fill="black"/>
</svg>

    </span>
    Apple
  </button>

  <button className="social-btn">
    <span className="icon">
      {/* Facebook SVG */}
      <svg width="18" height="18" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 12.0733C25 5.40546 19.4035 0 12.5 0C5.59648 0 0 5.40546 0 12.0733C0 18.0994 4.57109 23.0943 10.5469 24V15.5633H7.37305V12.0733H10.5469V9.41343C10.5469 6.38755 12.4131 4.71615 15.2684 4.71615C16.6359 4.71615 18.0664 4.95195 18.0664 4.95195V7.92313H16.4902C14.9374 7.92313 14.4531 8.85381 14.4531 9.80864V12.0733H17.9199L17.3657 15.5633H14.4531V24C20.4289 23.0943 25 18.0995 25 12.0733Z" fill="#1877F2"/>
    </svg>

    </span>
    Facebook
  </button>
</div>
          </div>

          <div className="legal">
            By continuing, you agree to SnapSolve{' '}
            <a href="#"><b>Terms of Service</b></a><br></br> and{' '}
            <a href="#"><b>Privacy Policy</b></a>
          </div>
        </form>
      </div>

      <div className="login-image-section">
      <img src={noprosze} alt="Login" />
      </div>
    </div>
  );
}

export default Logowanie;