// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AddRestaurant from "./AddResturant";
// import appleIcon from "../photos/apple-icon.png";
// import './Register.css';

// const RegistrationForm = () => {
//     const [step, setStep] = useState(1) // Once the page loads to the user step 1 happens.
//     const [username, setUsername] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [user_type, setUserType] = useState("");  
//     const [phonenum, setPhonenum] = useState(" ")
//     const [message, setMessage] = useState("");
//     const [registrationSuccessful, setRegistrationSuccessful] = useState(false);

//     const navigate = useNavigate();

//     const handleSelectUserType = (type)=>{
//         setUserType(type);
//         setStep(2);
//     }
    
//     const registerUser = () => {
//         fetch('http://127.0.0.1:5005/users/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, email, password, user_type, phonenum }),
//         })
//             .then((response) => {
//                 if (!response.ok) {
//                     throw new Error('Registration failed');
//                 }
//                 setMessage("Registration successful");
//                 alert("Registration successful");
//                 if (user_type === "restaurant_owner") {
//                     setRegistrationSuccessful(true); 
//                 } else {
//                     navigate("/"); 
//                 }
//             })
//             .catch((error) => {
//                 setMessage(error.message);
//                 alert(error.message);
//             })
//     };
//     return (
//         <div className="registration-div">
//             {step === 1 && (
//             <div className="select-user-type">
//                 <h1>Choose User Type</h1>
//                 <button 
//                 className="userType-button"
//                 onClick={()=>handleSelectUserType("regular_user")} >
//                     Normal User
//                 </button>
//                 <button
//                 className="userType-button"
//                 onClick={()=> handleSelectUserType("restaurant_owner")}>
//                     Restaurant Owner
//                 </button>
//             </div>
//             )}
//             {step === 2 && !registrationSuccessful && ( 
//                 <div className="registration-form">
//             <h1>Registration Form</h1>
//             <p> 
//                 Registering as:{" "}
//                 <strong>{user_type === "regular" ? "regular_user": "restaurant_owner"}</strong>
//                 </p>
//             <form
//                 onSubmit={(e) => {
//                     e.preventDefault(); 
//                     registerUser();
//                 }}
//             >
//                 <label>Username:</label>
//                 <input
//                     type="text"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                 />
//                 <br />
//                 <label>Email:</label>
//                 <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />
//                 <br />
//                 <label>Password:</label>
//                 <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />
//                 <br />
//                 <label>Phone Number:</label>
//                 <input
//                     type="text"
//                     value={phonenum}
//                     onChange={(e) => setPhonenum(e.target.value)}
//                 />
//                 <br />
//                 <button type="submit">Register</button>
//             </form>
//             <div className="registration-icons">
//                         <img
//                             src={appleIcon}
//                             alt="Register with Apple"
//                             className="registration-icon"
//                         />
//                     </div>
//             {message && <p>{message}</p>}
//         </div>
//             )}
//             {registrationSuccessful && <AddRestaurant />}
//         </div>
//     );
// };

// export default RegistrationForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userType, setUserType] = useState(null); 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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

    const { username, email, password, phonenum } = formData;

    if (!username || !email || !password || !phonenum) {
      alert("All fields are required.");
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
      } } else {
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
    <div>
      <h1>Register</h1>

      {!userType ? (
        <div>
          <h2>Select User Type</h2>
          <button onClick={() => setUserType("regular_user")}>Regular User</button>
          <button onClick={() => setUserType("restaurant_owner")}>Restaurant Owner</button>
        </div>
        ) : showRestaurantForm ? (
            <form onSubmit={handleAddRestaurant}>
              <h2>Add Restaurant</h2>
    
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={restaurantForm.name}
                  onChange={handleRestaurantInputChange}
                  required
                />
              </label>
              <br />
            
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={restaurantForm.location}
              onChange={handleRestaurantInputChange}
              required
            />
          </label>
          <br />

          <label>
            Cuisine:
            <input
              type="text"
              name="cuisine"
              value={restaurantForm.cuisine}
              onChange={handleRestaurantInputChange}
              required
            />
          </label>
          <br />
          <label>
            Max Capacity:
            <input
              type="number"
              name="maxcapacity"
              value={restaurantForm.maxcapacity}
              onChange={handleRestaurantInputChange}
              required
            />
          </label>
          <br />

          <label>
            Halal:
            <input
              type="text"
              name="halal"
              value={restaurantForm.halal}
              onChange={handleRestaurantInputChange}
            />
          </label>
          <br />
          <label>
            Minimum Health Rating:
            <input
              type="text"
              name="minHealthRating"
              value={restaurantForm.minHealthRating}
              onChange={handleRestaurantInputChange}
            />
          </label>
          <br />

          <label>
            Dietary Options:
            <input
              type="text"
              name="dietary"
              value={restaurantForm.dietary}
              onChange={handleRestaurantInputChange}
            />
          </label>
          <br />

          <button type="submit">Add Restaurant</button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h2>Register as {userType.replace("_", " ")}</h2>

          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <label>
            Phone Number:
            <input
              type="text"
              name="phonenum"
              value={formData.phonenum}
              onChange={handleInputChange}
              required
            />
          </label>
          <br />

          <button type="submit">Register</button>
          <button type="button" onClick={() => setUserType(null)}>
            Go Back
          </button>
        </form>
      )}
    </div>
  );
};

export default Register;
