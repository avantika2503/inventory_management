import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4567/login', { username, password });
            if (response.status === 200) {
                if (response.data === "Admin login successful") {
                    console.log("Admin login successful, navigating to admin dashboard...");
                    navigate('/admin-dashboard');
                } else if (response.data === "User login successful") {
                    console.log("User login successful, navigating to inventory...");
                    navigate('/user-dashboard');
                }
            }
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-page">
            {/* <h1 className="inventory-title">Inventory Management</h1> */}
            <div className="login-container">
                <h2>Login</h2>
                <p className="login-subtitle">Login to view inventory!</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                    />
                    <input
                        type="password"
                        id="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <div className="login-options">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="register-link">Not registered yet? <a href="#" onClick={() => navigate('/register')}>Create a new account</a></p>
            </div>
        </div>
    );
};

export default Login;
