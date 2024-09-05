import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { registerUser } from './api'; 

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }
        try {
            const { email, ...userData } = formData;
            const result = await registerUser(userData); 
            console.log('User registered successfully:', result);
            alert('Registered Successfully!');
            navigate('/login');  
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };
    

    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Register</h2>
                <p className="register-subtitle">Manage all your inventory efficiently</p>
                <p>Let’s get you all set up so you can verify your personal account and begin setting up your profile</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="half-width">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                className="register-input"
                            />
                        </div>
                        <div className="half-width">
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="register-input"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="half-width">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                className="register-input"
                            />
                        </div>
                        <div className="half-width">
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="phone number"
                                className="register-input"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="register-input full-width"
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input type="checkbox" /> I agree to all terms, privacy policies, and fees
                        </label>
                    </div>
                    <button type="submit" className="register-button">Sign up</button>
                </form>
                <p className="login-link">Already have an account? <a href="#" onClick={() => navigate('/login')}>Log in</a></p>
            </div>
        </div>
    );
};

export default Register;