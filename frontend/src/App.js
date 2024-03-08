import React from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import IOAPage from './pages/IOAPage';
import USFPage from './pages/USFPage';

function App()
{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<LoginPage/>} />
        <Route path="/register" index element={<RegisterPage/>} />
        <Route path='/landing' index element={<LandingPage/>} />
        <Route path='/parks/64' index element={<IOAPage/>}/>
        <Route path='/parks/65' index element={<USFPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;