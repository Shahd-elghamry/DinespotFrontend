import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { BASE_URL } from '../config';
import './ControlPanel.css';
import { FaTrash, FaUser, FaEdit } from 'react-icons/fa';

const ControlPanel = () => {
    const navigate = useNavigate();
    const { userType } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('users');
    const [editingRestaurant, setEditingRestaurant] = useState(null);

    useEffect(() => {
        if (userType !== 'admin') {
            navigate('/');
            return;
        }

        fetchUsers();
        fetchRestaurants();
    }, [userType, navigate]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BASE_URL}/admin/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchRestaurants = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5005/resturant');
            if (!response.ok) throw new Error('Failed to fetch restaurants');
            const data = await response.json();
            setRestaurants(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete user');
            setUsers(users.filter(user => user.id !== userId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteRestaurant = async (restaurantId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`http://127.0.0.1:5005/resturant/${restaurantId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to delete restaurant: ${errorData}`);
            }

            setRestaurants(restaurants.filter(restaurant => restaurant.id !== restaurantId));
            setError(null);
        } catch (error) {
            console.error('Error deleting restaurant:', error);
            setError(error.message);
        }
    };

    const handleEditRestaurant = async (restaurant) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('Authentication required');
            }

            // Create the update object with only the fields we want to update
            const updateData = {
                name: restaurant.name,
                location: restaurant.location,
                cuisine: restaurant.cuisine,
                maxcapacity: restaurant.maxcapacity || 0,
                halal: restaurant.halal || "no",
                minHealthRating: restaurant.minHealthRating || 0,
                dietary: restaurant.dietary || ""
            };

            const response = await fetch(`http://127.0.0.1:5005/resturant/edit/${restaurant.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Failed to update restaurant: ${errorData}`);
            }
            
            // Update the restaurants list with the edited restaurant
            setRestaurants(restaurants.map(r => 
                r.id === restaurant.id ? { ...r, ...updateData } : r
            ));
            setEditingRestaurant(null);
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error updating restaurant:', error);
            setError(error.message);
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="control-panel">
            <div className="control-panel-header">
                <h1>Admin Control Panel</h1>
                <div className="tab-buttons">
                    <button 
                        className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'restaurants' ? 'active' : ''}`}
                        onClick={() => setActiveTab('restaurants')}
                    >
                        Restaurants
                    </button>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="error">{error}</div>}

            {activeTab === 'users' && (
                <div className="users-section">
                    <div className="table-header">
                        <div className="header-cell">Username</div>
                        <div className="header-cell">Email</div>
                        <div className="header-cell">User Type</div>
                        <div className="header-cell">Actions</div>
                    </div>
                    {filteredUsers.map(user => (
                        <div key={user.id} className="table-row">
                            <div className="cell">
                                <FaUser className="user-icon" />
                                {user.username}
                            </div>
                            <div className="cell">{user.email}</div>
                            <div className="cell">{user.userType}</div>
                            <div className="cell actions">
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'restaurants' && (
                <div className="restaurants-section">
                    <div className="table-header">
                        <div className="header-cell">Name</div>
                        <div className="header-cell">Location</div>
                        <div className="header-cell">Cuisine</div>
                        <div className="header-cell">Actions</div>
                    </div>
                    {filteredRestaurants.map(restaurant => (
                        <div key={restaurant.id} className="table-row">
                            {editingRestaurant?.id === restaurant.id ? (
                                <>
                                    <div className="cell">
                                        <input
                                            type="text"
                                            value={editingRestaurant.name}
                                            onChange={(e) => setEditingRestaurant({
                                                ...editingRestaurant,
                                                name: e.target.value
                                            })}
                                            placeholder="Restaurant Name"
                                        />
                                    </div>
                                    <div className="cell">
                                        <input
                                            type="text"
                                            value={editingRestaurant.location}
                                            onChange={(e) => setEditingRestaurant({
                                                ...editingRestaurant,
                                                location: e.target.value
                                            })}
                                            placeholder="Location"
                                        />
                                    </div>
                                    <div className="cell">
                                        <input
                                            type="text"
                                            value={editingRestaurant.cuisine}
                                            onChange={(e) => setEditingRestaurant({
                                                ...editingRestaurant,
                                                cuisine: e.target.value
                                            })}
                                            placeholder="Cuisine"
                                        />
                                    </div>
                                    <div className="cell">
                                        <div className="edit-fields">
                                            <select
                                                value={editingRestaurant.halal}
                                                onChange={(e) => setEditingRestaurant({
                                                    ...editingRestaurant,
                                                    halal: e.target.value
                                                })}
                                            >
                                                <option value="yes">Halal</option>
                                                <option value="no">Non-Halal</option>
                                            </select>
                                            <input
                                                type="number"
                                                value={editingRestaurant.maxcapacity}
                                                onChange={(e) => setEditingRestaurant({
                                                    ...editingRestaurant,
                                                    maxcapacity: parseInt(e.target.value)
                                                })}
                                                placeholder="Max Capacity"
                                            />
                                            <input
                                                type="number"
                                                value={editingRestaurant.minHealthRating}
                                                onChange={(e) => setEditingRestaurant({
                                                    ...editingRestaurant,
                                                    minHealthRating: parseInt(e.target.value)
                                                })}
                                                placeholder="Health Rating"
                                                min="0"
                                                max="5"
                                            />
                                            <input
                                                type="text"
                                                value={editingRestaurant.dietary}
                                                onChange={(e) => setEditingRestaurant({
                                                    ...editingRestaurant,
                                                    dietary: e.target.value
                                                })}
                                                placeholder="Dietary Options"
                                            />
                                        </div>
                                        <div className="action-buttons">
                                            <button
                                                className="save-btn"
                                                onClick={() => handleEditRestaurant(editingRestaurant)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="cancel-btn"
                                                onClick={() => setEditingRestaurant(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="cell">{restaurant.name}</div>
                                    <div className="cell">{restaurant.location}</div>
                                    <div className="cell">{restaurant.cuisine}</div>
                                    <div className="cell actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditingRestaurant(restaurant)}
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteRestaurant(restaurant.id)}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ControlPanel;
