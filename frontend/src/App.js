import React from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from './pages/RegisterPage';

function App()
{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<LoginPage/>} />
        <Route path="/register" index element={<RegisterPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;