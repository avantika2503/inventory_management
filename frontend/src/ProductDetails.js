import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css'; 

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');


    const productImageMap = {
        '1': 'product1.jpg',
        '2': 'product2.jpg',
        '3': 'product3.jpg',
        '4': 'product4.jpg',
        '5': 'product5.jpg',
        '6': 'product6.jpg',
        '7': 'product7.jpg',
        '8': 'product8.jpg',
        '9': 'product9.jpg',
        '10': 'product10.jpg'
    };

    const productDetailsMap = {
        '1': {
            operatingSystem: 'N/A',
            specialFeature: 'N/A',
            connectivity: 'N/A',
            wireless: 'N/A',
            shape: 'N/A',
            description: 'N/A'
        },
        '2': {
        name: 'Watch',
        operatingSystem: 'N/A',
        specialFeature: 'Smart-watch',
        connectivity: 'Bluetooth, Wi-Fi',
        wireless: 'wireless charging',
        shape: 'Square',
        description: 'Smart-watch'
    },
    '3': {
        name: 'Tablet',
        operatingSystem: 'Android',
        specialFeature: '10-inch screen',
        connectivity: 'Wi-Fi, Bluetooth',
        wireless: '4G LTE',
        shape: 'Rectangle',
        description: '10-inch Android tablet'
    },
    '4': {
        name: 'Laptop',
        operatingSystem: 'Linux',
        specialFeature: 'High-end gaming',
        connectivity: 'Wi-Fi, Bluetooth',
        wireless: 'N/A',
        shape: 'Rectangle',
        description: 'High-end gaming laptop'
    },
    '5': {
        name: 'Headphones',
        operatingSystem: 'N/A',
        specialFeature: 'Wireless noise-canceling',
        connectivity: 'Bluetooth',
        wireless: 'Bluetooth',
        shape: 'Over-ear',
        description: 'Wireless noise-canceling headphones'
    },
    '6': {
        name: 'Monitor',
        operatingSystem: 'Windows 11',
        specialFeature: '4K resolution',
        connectivity: 'HDMI, DisplayPort',
        wireless: 'N/A',
        shape: 'Rectangle',
        description: '27-inch 4K monitor'
    },
    '7': {
        name: 'Keyboard',
        operatingSystem: 'N/A',
        specialFeature: 'Mechanical',
        connectivity: 'USB',
        wireless: 'Bluetooth',
        shape: 'Rectangle',
        description: 'Mechanical keyboard'
    },
    '8': {
        name: 'Phone',
        operatingSystem: 'N/A',
        specialFeature: 'Button-phone',
        connectivity: '2G',
        wireless: 'N/A',
        shape: 'Rectangle',
        description: 'Nokia button-phone'
    },
    '9': {
        name: 'Mouse',
        operatingSystem: 'N/A',
        specialFeature: 'Wireless gaming',
        connectivity: 'USB',
        wireless: 'Bluetooth',
        shape: 'Ergonomic',
        description: 'Wireless gaming mouse'
    },
    '10': {
        name: 'Printer',
        operatingSystem: 'N/A',
        specialFeature: 'All-in-one',
        connectivity: 'Wi-Fi, USB',
        wireless: 'Wi-Fi, Bluetooth',
        shape: 'Rectangle',
        description: 'Wireless all-in-one printer'
    }
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:4567/products/${id}`);
                const productData = response.data;

                productData.image = productImageMap[id] || 'default.jpg';
                const additionalDetails = productDetailsMap[id] || {};
                setProduct({ ...productData, ...additionalDetails });
            } catch (error) {
                setError('Error fetching product details');
                console.error('Error fetching product details:', error);
            }
        };


        fetchProductDetails();
    }, [id]);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!product) {
        return <p>Loading product details...</p>;
    }

    const imagePath = `/images/${product.image}`;

    const stockStatus = product.quantity > 0 ? 'In Stock' : 'Out of Stock';
    const stockStatusClass = product.quantity > 0 ? 'in-stock' : 'out-of-stock';

    return (
        <div className="product-details-container">
            <div className="product-image">
                <img src={imagePath} alt={product.name} />
            </div>
            <div className="product-info">
                <h1>{product.name}</h1>
                <p className="price">₹{product.price}</p>
                <ul className="product-features">
                    <li><strong>Operating System:</strong> {product.operatingSystem || 'N/A'}</li>
                    <li><strong>Special Feature:</strong> {product.specialFeature || 'N/A'}</li>
                    <li><strong>Connectivity Technology:</strong> {product.connectivity || 'N/A'}</li>
                    <li><strong>Wireless Communication:</strong> {product.wireless || 'N/A'}</li>
                    <li><strong>Shape:</strong> {product.shape || 'N/A'}</li>
                    <li><strong>Description:</strong> {product.description}</li>
                </ul>
                <div className={`stock-status ${stockStatusClass}`}>{stockStatus}</div>

            </div>
            <div className="go-back-button-container">
                <Link to="/user-dashboard" className="go-back-button">Go Back</Link>
            </div>
        </div>
    );
};

export default ProductDetails;
