import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Logowanie() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Logowanie</h1>
        <form onSubmit={handleSubmit}>
          <label>Email:<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><br />
          <label>Hasło:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label><br />
          <button type="submit">Zaloguj się</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <button onClick={() => navigate('/rejestracja')} style={{ marginTop: '20px' }}>
          Nie masz konta? Zarejestruj się
        </button>
      </header>
    </div>
  );
}

export default Logowanie;
