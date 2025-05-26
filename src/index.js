import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Logowanie from './pages/log_in/logowanie.js';
import './pages/log_in/logowanie.css';
import Main from './pages/main/main.js';
<<<<<<< HEAD
import './pages/main/main.css';
=======
>>>>>>> 0d974e7f4b79bab9948f7329d322713f68d6f32b
import AddQuestion from './pages/add_question/addquestion.js';
import Zakladki from './pages/bookmarks/zakładki';
import Settings from './pages/settings/settings.js';
import './pages/log_in/logowanie.css';
import './pages/add_question/addquestion.css';
<<<<<<< HEAD
import Zakladki from './pages/bookmarks/zakładki.js';
import Help from './pages/help/help.js';


=======
>>>>>>> 0d974e7f4b79bab9948f7329d322713f68d6f32b

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