import React, { useState } from 'react';
import './registerpage.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

async function register(credentials) {
    return fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(data => data.json());
}

// Sample TA data for verification
const TAData = {
    "CS-1332": { "Sam Neill": "sneill@gatech.edu", "Laura Dern": "ldern@gatech.edu" },
    "CS-1331": { "Sydney Tod": "stod@gatech.edu", "Jeff Goldblum": "jgoldblum@gatech.edu" },
    "CS-1100": { "Joseph Mazzello": "jmazzello@gatech.edu", "Jessie": "jessierigsbee@gmail.com" }
};

const flattenTAEmails = () => {
    return Object.values(TAData).flatMap(course => Object.values(course));
};

const RegisterPage = ({ setToken }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const { setUserEmail } = useUser();
    const navigate = useNavigate();
    
    const handleSubmit = async e => {
        e.preventDefault();

        // Check if email is in the list of TA emails
        const taEmails = flattenTAEmails();
        const isTA = taEmails.includes(email);

        // Proceed with registration and set isTA based on email verification
        const token = await register({
            "email": email,
            "password": password,
            "fullname": name,
            "isTa": isTA
        });
        
        setToken(token);
        setUserEmail(email);

        if (token.isTa) {
            return navigate('/inbox');
        } else {
            return navigate('/');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="register-page-wrapper">
            <div className="register-container">
                <h1>Georgia Tech Registration</h1>
                <p>Register with your Georgia Tech email to send cards to your TAs and teachers.</p>

                <form action="/register" method="POST" onSubmit={handleSubmit}>
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={e => setName(e.target.value)}
                        placeholder="Your Full Name"
                        required
                    />

                    <label htmlFor="email">Georgia Tech Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="example@gatech.edu"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Create a password"
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="eye-icon"
                            onClick={togglePasswordVisibility}
                            role="button"
                            aria-label="Toggle password visibility"
                        >
                            {passwordVisible ? "👁️‍🗨️" : "👁️"}
                        </span>
                    </div>
                    <input type="submit" value="Register" />
                </form>

                <div className="footer">
                    <p>
                        Already registered? <a href="/login">Log in here</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
