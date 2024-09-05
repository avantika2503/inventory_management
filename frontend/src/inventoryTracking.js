import React, { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct } from './api';
import { Link } from 'react-router-dom';

const InventoryTracking = () => {
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

    const handleDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            setProducts(products.filter(product => product.productId !== productId));
        } catch (error) {
            setError(`Error deleting product with ID ${productId}`);
            console.error(`Error deleting product with ID ${productId}:`, error);
        }
    };

    return (
        <div>
            <h1>Inventory Tracking</h1>
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
                                {/* <Link to={`/update-product/${product.productId}`}>Update</Link> */}
                                <button onClick={() => handleDelete(product.productId)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTracking;