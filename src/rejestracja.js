import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Rejestracja() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne!');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setError('Użytkownik z tym adresem email już istnieje!');
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    navigate('/');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rejestracja</h1>
        <form onSubmit={handleSubmit}>
          <label>Imię:<input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label><br />
          <label>Email:<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><br />
          <label>Hasło:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label><br />
          <label>Potwierdź hasło:<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></label><br />
          <button type="submit">Zarejestruj się</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        <br />
        <button onClick={() => navigate('/')}>Logowanie</button>
      </header>
    </div>
  );
}

export default Rejestracja;
