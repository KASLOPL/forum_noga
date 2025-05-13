import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Main() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Witaj, {currentUser ? currentUser.name : 'nieznajomy'}!</h1>
        <p>To jest strona główna</p>
        <button onClick={handleLogout}>Wyloguj się</button>
      </header>
    </div>
  );
}

export default Main;
