import React from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import StartingPage from './pages/StartingPage'
import IOAPage from './pages/IOAPage';
import USFPage from './pages/USFPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RidesPage from './pages/RidesPage';
import TripsPage from './pages/TripsPage';

function App()
{
  console.log('Rendering App component');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<StartingPage/>} />
        <Route path="/login" index element={<LoginPage/>} />
        <Route path="/register" index element={<RegisterPage/>} />
        <Route path='/landing' index element={<LandingPage/>} />
        <Route path ='/rides/:parkID' index element={<RidesPage/>}/>
        <Route path ='/trips/:tripID' index element={<TripsPage/>}/>
        <Route path='/forgot-password' index element={<ForgotPasswordPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;