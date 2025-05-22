import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
 HEAD
import Logowanie from './logowanie';
import Rejestracja from './rejestracja';
import Main from './main';
import AddQuestion from './addquestion';
import Zakladki from './zakładki';
import Settings from './settings';

import Logowanie from './pages/log_in/logowanie.js';
import './pages/log_in/logowanie.css';

import Rejestracja from './pages/sing_up/rejestracja.js';

import Main from './pages/main/main.js';

import AddQuestion from './pages/add_question/addquestion.js';
import './pages/add_question/addquestion.css';

import Zakladki from './pages/bookmarks/zakładki.js';

 ee18ddfc9b55b7c1f88ec5c7a5fb6eb8732207a3

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
        <Route path="/zakładki" element={<Zakladki />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
