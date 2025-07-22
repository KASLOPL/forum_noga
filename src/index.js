import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Logowanie from './pages/log_in/logowanie.js';
import './pages/log_in/logowanie.css';

import Main, { UserProvider } from './pages/main/main.js';
import './pages/main/main.css';

import AddQuestion from './pages/add_question/addquestion.js';
import './pages/add_question/addquestion.css';

import Zakladki from './pages/bookmarks/zakładki';  
import Settings from './pages/settings/settings.js';
import Help from './pages/help/help.js';
import Profile from './pages/profile/profile.js'
import QuestionDetail from './pages/answ_question/answer_q';
import MyQuestions from './pages/my_questions/my_questions.js';
import Search from './pages/search/search.js';
import ResetPassword from './pages/reset_password/ResetPassword.js';
import { LogoutProvider } from './hooks/logout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LogoutProvider><Logowanie /></LogoutProvider>} />
          <Route path="/logowanie" element={<LogoutProvider><Logowanie /></LogoutProvider>} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/main" element={<LogoutProvider><Main /></LogoutProvider>} />
          <Route path="/addquestion" element={<LogoutProvider><AddQuestion /></LogoutProvider>} />
          <Route path="/zakładki" element={<LogoutProvider><Zakladki /></LogoutProvider>} />
          <Route path="/help" element={<LogoutProvider><Help /></LogoutProvider>} />
          <Route path="/profile" element={<LogoutProvider><Profile /></LogoutProvider>} />
          <Route path="/answer_q/:id" element={<LogoutProvider><QuestionDetail /></LogoutProvider>} />
          <Route path="/my_questions" element={<LogoutProvider><MyQuestions /></LogoutProvider>} />
          <Route path="/search" element={<LogoutProvider><Search /></LogoutProvider>} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
