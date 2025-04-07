import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Logowanie() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Wysłano: ${name}, ${email}`);
  };

  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Logowanie</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Imię:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <br />
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <br />
          <button type="submit">Zaloguj się</button>
        </form>
        <button 
          onClick={() => navigate('/rejestracja')}
          style={{ marginTop: '20px' }}
        >
          Zarejestruj się
        </button>
      </header>
    </div>
  );
}

export default Logowanie;
