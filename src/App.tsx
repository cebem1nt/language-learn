import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './App.scss';
import 'animate.css';
import WelcomePage from './pages/welcome_page/welome_page';
import HomePage from './pages/main_page/main.page';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/welcome" />}/>
        <Route path='/welcome' element={<WelcomePage />} />
        <Route path='/home/*' element={<HomePage />} />
      </Routes>
    </Router>
  )
}