import React, { useState } from 'react';
import { addProduct } from './api';
import { Link } from 'react-router-dom';
import './AddProduct.css'; 

const AddProduct = () => {
    const [product, setProduct] = useState({
        productId: '',
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
        lifecycleStage: '',
        supplierId: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'productId' && value.length > 6) {
            setError('Product ID should not be more than 6 characters.');
        } else {
            setError(''); 
        }

        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (error) {
            alert('Please fix the errors before submitting.');
            return;
        }

        try {
            await addProduct(product);
            setProduct({
                productId: '',
                name: '',
                description: '',
                category: '',
                price: '',
                quantity: '',
                lifecycleStage: '',
                supplierId: ''
            });
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="add-product-container">
            <h1 className="title">Add Product</h1>
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product ID</label>
                    <input
                        type="text"
                        name="productId"
                        value={product.productId}
                        onChange={handleChange}
                        placeholder="Product ID"
                        required
                    />
                    {error && <p className="error-message">{error}</p>} {/* Display error message */}
                </div>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        placeholder="Category"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="Price"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={product.quantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Lifecycle Stage</label>
                    <input
                        type="text"
                        name="lifecycleStage"
                        value={product.lifecycleStage}
                        onChange={handleChange}
                        placeholder="Lifecycle Stage"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Supplier ID</label>
                    <input
                        type="number"
                        name="supplierId"
                        value={product.supplierId}
                        onChange={handleChange}
                        placeholder="Supplier ID"
                        required
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="add-product-button" disabled={!!error}>
                        Add Product
                    </button>
                </div>
            </form>
            <div className="go-back-button-container">
                <Link to="/admin-dashboard" className="go-back-button">Go Back</Link>
            </div>
        </div>
    );
};

export default AddProduct;
