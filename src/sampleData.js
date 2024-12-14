// Sample Users
export const users = [
    {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
        phonenum: "0123456789",
        userType: "regular_user"
    },
    {
        id: 2,
        username: "restaurant_owner",
        email: "owner@restaurant.com",
        password: "owner123",
        phonenum: "0987654321",
        userType: "restaurant_owner"
    },
    {
        id: 3,
        username: "admin_user",
        email: "admin@dinespot.com",
        password: "admin123",
        phonenum: "0123498765",
        userType: "admin"
    }
];

// Sample Restaurants
export const restaurants = [
    {
        id: 1,
        name: "The Italian Corner",
        location: "123 Main Street",
        cuisine: "Italian",
        maxcapacity: 50,
        halal: true,
        minHealthRating: 4.5,
        dietary: ["Vegetarian", "Vegan options"],
        description: "Authentic Italian cuisine in a cozy atmosphere",
        rating: 4.8,
        reviews: [
            {
                userId: 1,
                rating: 5,
                comment: "Amazing pasta and great service!"
            }
        ],
        images: [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
            "https://images.unsplash.com/photo-1552566626-52f8b828add9"
        ],
        ownerId: 2
    },
    {
        id: 2,
        name: "Sushi Master",
        location: "456 Ocean Drive",
        cuisine: "Japanese",
        maxcapacity: 40,
        halal: true,
        minHealthRating: 4.8,
        dietary: ["Gluten-free options", "Vegetarian"],
        description: "Premium sushi and Japanese delicacies",
        rating: 4.9,
        reviews: [
            {
                userId: 1,
                rating: 5,
                comment: "Best sushi in town!"
            }
        ],
        images: [
            "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
            "https://images.unsplash.com/photo-1553621042-f6e147245754"
        ],
        ownerId: 2
    },
    {
        id: 3,
        name: "Mediterranean Delight",
        location: "789 Olive Street",
        cuisine: "Mediterranean",
        maxcapacity: 60,
        halal: true,
        minHealthRating: 4.3,
        dietary: ["Vegetarian", "Vegan options", "Gluten-free"],
        description: "Traditional Mediterranean dishes with a modern twist",
        rating: 4.6,
        reviews: [
            {
                userId: 1,
                rating: 4,
                comment: "Great hummus and falafel!"
            }
        ],
        images: [
            "https://images.unsplash.com/photo-1544124499-58912cbddaad",
            "https://images.unsplash.com/photo-1600891964092-4316c288032e"
        ],
        ownerId: 2
    }
];

// Sample Bookings
export const bookings = [
    {
        id: 1,
        userId: 1,
        restaurantId: 1,
        date: "2024-12-20",
        time: "19:00",
        numberOfGuests: 4,
        status: "confirmed",
        specialRequests: "Window seat preferred"
    },
    {
        id: 2,
        userId: 1,
        restaurantId: 2,
        date: "2024-12-25",
        time: "20:00",
        numberOfGuests: 2,
        status: "pending",
        specialRequests: "Anniversary celebration"
    }
];

// Sample Reviews
export const reviews = [
    {
        id: 1,
        userId: 1,
        restaurantId: 1,
        rating: 5,
        comment: "Excellent food and service!",
        date: "2024-12-01"
    },
    {
        id: 2,
        userId: 1,
        restaurantId: 2,
        rating: 4,
        comment: "Great atmosphere, slightly pricey",
        date: "2024-12-05"
    }
];
