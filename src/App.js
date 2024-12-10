import React from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Import necessary router components
import Navbar from "./Components/Navbar";
import Home from './Components/Home'; // Assuming these components are in the 'Components' folder
import Lists from './Components/Lists';
import Contact from './Components/Contact';
import LoginForm from './Components/Login';
import RegistrationForm from './Components/Register';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <div style={{ height: '200vh', paddingTop: '70px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
