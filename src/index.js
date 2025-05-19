import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Logowanie from './logowanie';
import Rejestracja from './rejestracja';
import Main from './main';
import AddQuestion from './addquestion';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Logowanie />} />
        <Route path="/logowanie" element={<Logowanie />} />
        <Route path="/rejestracja" element={<Rejestracja />} />
        <Route path="/main" element={<Main />} />
        <Route path="/addquestion" element={<AddQuestion />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
