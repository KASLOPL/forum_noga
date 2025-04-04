import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Wysłano: ${name}, ${email}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Prosty Formularz</h1>
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
          <button type="submit">Wyślij</button>
        </form>
      </header>
    </div>
  );
}

export default App;
