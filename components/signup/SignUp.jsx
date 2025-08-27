import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Eye icon for showing the password
const EyeIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        {/* This is the corrected path for the outer eye shape */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5C7.229 4.5 3.121 7.838 1.5 12c1.621 4.162 5.729 7.5 10.5 7.5s8.879-3.338 10.5-7.5C20.879 7.838 16.771 4.5 12 4.5z" />
        {/* This is the path for the inner pupil */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// Eye-slash icon for hiding the password
const EyeSlashIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

// Main SignupPage component
function SignUp() {
    // State for form fields
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // State for validation errors
    const [errors, setErrors] = useState({});

    // State for password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    // Regex for validation
    const usernameRegex = /^[a-zA-Z_]{3,20}$/;
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;


    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Validate all fields
        if (!username) {
            newErrors.username = 'Username is required.';
        } else if (!usernameRegex.test(username)) {
            newErrors.username = 'Username must be 3-20 letters or underscores.';
        }

        if (!email) {
            newErrors.email = 'Email is required.';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required.';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        if (!agreedToTerms) {
            newErrors.agreedToTerms = 'You must agree to the Terms and Privacy Policy.';
        }

        // Set the errors and check if the form is valid
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            // Form is valid, perform signup logic
            console.log('Form submitted successfully!');

            try {
                // Send data to backend
                console.log("sending data ",username , email ,password)
                const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
                    username: username,
                    email: email,
                    password: password
                });

                 
                navigate('/home'); // Redirect to home page after successful signup

                // success response handling
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }

            catch (error) {
                if (error.response) {
                    // The server responded with an error status (like 409, 400, etc.)
                    console.error(error.response.data);
                    setErrors({ api: error.response.data.message || "An error occurred during signup." });
                }else {
                    // Something else went wrong
                    console.error("Error", error.message);
                    setErrors({ api: "Network error. Please check your connection." });
                }
            }
            // In a real app, you would make an API call here
            // e.g., registerUser({ username, email, password });
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl space-y-6">
                {/* Site Name */}
                <h1
                    className="text-center text-4xl font-bold text-white"
                    style={{ textShadow: '0 0 10px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)' }}
                >
                    ShrinkIt
                </h1>

                {errors.api && (
                    <p className="text-red-400 text-sm mb-4 text-center">{errors.api}</p>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Input */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={() => {
                                const newErrors = { ...errors };
                                if (!usernameRegex.test(username)) {
                                    newErrors.username = 'Username must be 3-20 letters or underscores.';
                                } else {
                                    delete newErrors.username;
                                }
                                setErrors(newErrors);
                            }}
                            className={`mt-1 block w-full px-4 py-2 bg-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                            placeholder="username"
                            aria-label="Username"
                        />
                        {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => {
                                const newErrors = { ...errors };
                                if (!emailRegex.test(email)) {
                                    newErrors.email = 'Please enter a valid email address.';
                                } else {
                                    delete newErrors.email;
                                }
                                setErrors(newErrors);
                            }}
                            className={`mt-1 block w-full px-4 py-2 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                            placeholder="you@example.com"
                            aria-label="Email Address"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`block w-full px-4 py-2 pr-12 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                                placeholder="••••••••"
                                aria-label="Password"
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-6 w-6" />
                                ) : (
                                    <EyeIcon className="h-6 w-6" />
                                )}
                            </div>
                        </div>
                        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400">Confirm Password</label>
                        <div className="relative mt-1">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`block w-full px-4 py-2 pr-12 bg-gray-700 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                                placeholder="••••••••"
                                aria-label="Confirm Password"
                            />
                            <div
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="h-6 w-6" />
                                ) : (
                                    <EyeIcon className="h-6 w-6" />
                                )}
                            </div>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-600 rounded bg-gray-700"
                                aria-label="I agree to the Terms and Privacy Policy"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-medium text-gray-400">
                                I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200">Terms and Privacy Policy</a>
                            </label>
                            {errors.agreedToTerms && <p className="mt-1 text-sm text-red-400">{errors.agreedToTerms}</p>}
                        </div>
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
                    >
                        Signup
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-400 font-semibold underline hover:text-indigo-300 transition-colors duration-200">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default SignUp;