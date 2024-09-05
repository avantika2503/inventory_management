import React from 'react';
import { Link } from 'react-router-dom';
import './adminDashboard.css'; 

const AdminDashboard = () => {

    const handleLogout = () => {
        window.location.href = '/login';
    };
    return (
        <div className="admin-dashboard-wrapper"> 
        <div className="logout-button-container">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="admin-dashboard">
                <h1>Admin Dashboard</h1>
                <p>Welcome, Admin! Here you can manage products and use functionalities like view inventory, add, update, and delete products.</p>
                <div className="dashboard-links">
                    <Link to="/inventory">View Inventory</Link>
                    <Link to="/add-product">Add Product</Link>
                    <Link to="/update-product">Update Product</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;