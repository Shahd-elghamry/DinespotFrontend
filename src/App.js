import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Navbar from "./Components/Navbar";
import Home from './Components/Home'; // These components are in the 'Components' folder
import Contact from './Components/Contact';
import Restaurant from './Components/Restaurants';
import LoginForm from './Components/Login';
import RegistrationForm from './Components/Register';
import Footer from "./Components/Footer";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ height: '200vh', paddingTop: '70px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
