export const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5005';

/**
 * Helper so later if i forgot what this function does
 * 
 * @param {string} endpoint - The API endpoint (e.g., '/restaurants').
 * @param {object} options - Any extra fetch options like the method and body. 
 * @returns {Promise} - Json response data 
 * @throws {Error} - If an error occured
 */

export const apiCall = async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }

    return response.json();
};
