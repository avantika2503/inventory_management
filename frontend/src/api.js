import axios from 'axios';

const API_URL = 'http://localhost:4567';

//register api
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Fetch all products
export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; 
    }
};

// Add a new product
export const addProduct = async (product) => {
    try {
        const response = await axios.post(`${API_URL}/products`, product);
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

// Update a product
export const updateProduct = async (productId, product) => {
    try {
        const response = await axios.put(`${API_URL}/products/${productId}`, product);
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

// Delete a product
export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`${API_URL}/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

// Fetch product stock levels for users
export const fetchProductStockLevels = async () => {
    try {
        const response = await axios.get(`${API_URL}/products/stock`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product stock levels:', error);
        throw error;
    }
};