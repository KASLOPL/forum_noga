import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Rejestracja() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Hasła nie są identyczne!');
      return;
    }
    alert(`Zarejestrowano: ${name}, ${email}`);
    navigate('/');
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Rejestracja</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Imię:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <br />
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <br />
          <label>
            Hasło:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <br />
          <label>
            Potwierdź hasło:
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </label>
          <br />
          <button type="submit">Zarejestruj się</button><br/>
        </form>
      </header>
    </div>
  );
}

export default Rejestracja;
