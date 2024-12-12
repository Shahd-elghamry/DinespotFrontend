import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Navbar from "./Components/Navbar";
import Home from './Components/Home'; // These components are in the 'Components' folder
import Restaurant from './Components/Restaurants';
import LoginForm from './Components/Login';
import RegistrationForm from './Components/Register';
import Footer from "./Components/Footer";
import AddRestaurant from './Components/AddResturant'; // Add this import if AddRestaurant is a valid component

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div style={{ height: '200vh', paddingTop: '70px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
            <Route path="/add-restaurant" element={<AddRestaurant />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
