import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Logowanie from './pages/log_in/logowanie.js';
import './pages/log_in/logowanie.css';
import Main from './pages/main/main.js';
import './pages/main/main.css';
import AddQuestion from './pages/add_question/addquestion.js';
import './pages/add_question/addquestion.css';
import Zakladki from './pages/bookmarks/zakładki.js';
import Help from './pages/help/help.js';



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
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);