import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';



const Register = () => {
  const [userType, setUserType] = useState(null); 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonenum: "",
  });

  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    location: "",
    cuisine: "",
    maxcapacity: "",
    halal: "",
    minHealthRating: "",
    dietary: "",
  });

  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRestaurantInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantForm({ ...restaurantForm, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userType) {
      alert("Please select a user type.");
      return;
    }

    const { username, email, password, confirmPassword, phonenum } = formData;

    if (!username || !email || !password || !confirmPassword || !phonenum) {
      alert("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5005/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, user_type: userType }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, message } = data;
    
        alert(message);
        localStorage.setItem("authToken", token);

        if (userType === "restaurant_owner") {
          setShowRestaurantForm(true);
        } else {
          navigate("/");
        }
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const {
      name,
      location,
      cuisine,
      maxcapacity,
      halal,
      minHealthRating,
      dietary,
    } = restaurantForm;

    if (!name || !location || !cuisine || !maxcapacity) {
      alert("Name, location, cuisine, and max capacity are required.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5005/addresturant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          location,
          cuisine,
          maxcapacity,
          halal,
          minHealthRating,
          dietary,
        }),
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
            navigate("/"); // Redirect to the home page
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="registration-div">
      {!userType ? (
        <div className="select-user-type">
          <h2>Select User Type</h2>
          <div>
            <button 
              className="userType-button" 
              onClick={() => setUserType("regular_user")}
            >
              Regular User
            </button>
            <button 
              className="userType-button" 
              onClick={() => setUserType("restaurant_owner")}
            >
              Restaurant Owner
            </button>
          </div>
        </div>
      ) : showRestaurantForm ? (
        <form className="registration-form" onSubmit={handleAddRestaurant}>
          <h1>Add Restaurant Details</h1>
          <div className="form-group">
            <label>Restaurant Name:</label>
            <input
              type="text"
              name="name"
              value={restaurantForm.name}
              onChange={handleRestaurantInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={restaurantForm.location}
              onChange={handleRestaurantInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Cuisine Type:</label>
            <input
              type="text"
              name="cuisine"
              value={restaurantForm.cuisine}
              onChange={handleRestaurantInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Maximum Capacity:</label>
            <input
              type="number"
              name="maxcapacity"
              value={restaurantForm.maxcapacity}
              onChange={handleRestaurantInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Halal Options:</label>
            <input
              type="text"
              name="halal"
              value={restaurantForm.halal}
              onChange={handleRestaurantInputChange}
            />
          </div>

          <div className="form-group">
            <label>Minimum Health Rating:</label>
            <input
              type="text"
              name="minHealthRating"
              value={restaurantForm.minHealthRating}
              onChange={handleRestaurantInputChange}
            />
          </div>

          <div className="form-group">
            <label>Dietary Options:</label>
            <input
              type="text"
              name="dietary"
              value={restaurantForm.dietary}
              onChange={handleRestaurantInputChange}
            />
          </div>

          <button type="submit">Add Restaurant</button>
        </form>
      ) : (
        <form className="registration-form" onSubmit={handleRegister}>
          <button type="button" className="back-button" onClick={() => setUserType(null)}>
            ↩
          </button>
          <h1>Register as {userType.replace("_", " ")}</h1>
          
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="text"
              name="phonenum"
              value={formData.phonenum}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit">Register</button>

          <div className="divider">
            <span>or</span>
          </div>

          <button type="button" className="continue-with-button apple">
            <FontAwesomeIcon icon={faApple} className="provider-icon" />
            Continue with Apple
          </button>

          <button type="button" className="continue-with-button google">
            <FontAwesomeIcon icon={faGoogle} className="provider-icon" />
            Continue with Google
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
