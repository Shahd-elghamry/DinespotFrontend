import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import { AuthProvider, PrivateRoute } from './AuthContext.js';
import Navbar from "./Components/Navbar";
import Home from './Components/Home';
import Restaurant from './Components/Restaurants';
import LoginForm from './Components/Login';
import RegistrationForm from './Components/Register';
import Footer from "./Components/Footer";
import AddRestaurant from './Components/AddRestaurant'; 
import NotFound from './Components/NotFound'; 
import RestaurantDetails from './Components/RestaurantDetails'; 
import BookingPage from './Components/BookingPage';
import EditProfile from './Components/EditProfile';
import FAQ from './Pages/FAQ';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/restaurant" element={<Restaurant />} />
              <Route path="/restaurant/:id" element={<RestaurantDetails />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/addRestaurant" element={<AddRestaurant />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/edit-profile" element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
