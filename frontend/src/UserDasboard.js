import React, { useState, useEffect } from 'react';
import { fetchProducts } from './api';
import { Link } from 'react-router-dom';
import './userDashboard.css'; 

const UserDasboard = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const getProducts = async () => {
            try {
                const products = await fetchProducts();
                if (isMounted) {
                    setProducts(products);
                }
            } catch (error) {
                setError('Error fetching products');
                console.error('Error fetching products:', error);
            }
        };

        getProducts();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = () => {
        window.location.href = '/login'; 
    };

    return (
        <div className="user-dashboard-wrapper">
            <div className="logout-button-container">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <h1>Inventory</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Lifecycle Stage</th>
                        <th>Supplier ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.productId}>
                            <td>{product.productId}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.lifecycleStage}</td>
                            <td>{product.supplierId}</td>
                            <td>
                                <Link to={`/view-product/${product.productId}`}>DETAILS</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserDasboard;