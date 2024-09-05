import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './login';
import Register from './Register';
import InventoryTracking from './inventoryTracking'; 
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDasboard';
import ProductDetails from './ProductDetails';

function App() {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/inventory" element={<InventoryTracking />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/update-product" element={<UpdateProduct />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/view-product/:id" element={<ProductDetails />} />
            </Routes>
        </div>
    );
}

export default App;
