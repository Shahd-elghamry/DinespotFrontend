import React from "react";

const Restaurant = () => {
    const restaurants = ["The Gourmet Spot", "Seafood Paradise", "Café Delight", "Urban Grill", "Bistro Bliss"];

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center", color: "#003366" }}>Our Restaurants</h1>
            <ul style={{ listStyleType: "none", padding: "0", textAlign: "center", color: "#d1852a" }}>
                {restaurants.map((name, index) => (
                    <li key={index} style={{ margin: "10px 0", fontSize: "1.2rem" }}>
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Restaurant;
