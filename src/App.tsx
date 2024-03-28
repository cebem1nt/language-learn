import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.scss';
import 'animate.css';
import WelcomePage from './pages/welcome_page/welome_page';
import HomePage from './pages/main_page/main.page';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/home/*' element={<HomePage />} />
      </Routes>
    </Router>
  )
}