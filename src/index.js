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
import Zakladki from './pages/bookmarks/zakładki';
import Settings from './pages/settings/settings.js';
import './pages/log_in/logowanie.css';
import './pages/add_question/addquestion.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Logowanie />} />
        <Route path="/logowanie" element={<Logowanie />} />
        <Route path="/main" element={<Main />} />
        <Route path="/addquestion" element={<AddQuestion />} />
        <Route path="/zakładki" element={<Zakladki />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
