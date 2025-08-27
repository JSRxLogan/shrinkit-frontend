import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// It's a good practice to have icons as separate components
// This makes the main component cleaner and the icons reusable.

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


/**
 * A sleek, user-friendly login form component with a modern dark theme.
 * Built with React and Tailwind CSS.
 */
const Login = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // In a real app, you'd handle authentication here

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid Gmail address";
    }

    if (!password) { // cap of password length can be defined here 
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Logging in with:', { email, password });

      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: email,
          password: password
        }, { withCredentials: true });

        // make the success response here and disable login details



        navigate('/home'); // Redirect to home page after successful login



        setEmail('');
        setPassword('');
        setErrors({});
        setShowPassword(false);

      }

      catch (error) {
        if (error.response) {
          console.log("Login failed, loc->53 react Login.jsx", error.response.data.message);
          setErrors({ api: error.response.data.message || "An error occurred during login." });
        } else {
          setErrors({ api: "Network error. Please check your connection." });
        }
      }
    }
  };

  return (
    // Main container with dark background, centering its child
    <main className="bg-gray-900 min-h-screen flex items-center justify-center p-4 font-sans">

      {/* Login form card */}
      <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header/Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-white"
            style={{ textShadow: '0 0 10px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)' }}
          >
            ShrinkIt
          </h1>

          {errors.api && (
            <p className="text-red-400 text-sm mb-4 text-center">{errors.api}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email or Username Input */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-400"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition duration-200 ease-in-out"
              placeholder="you@example.com"
              onBlur={() => {
                const newErrors = { ...errors };
                if (!emailRegex.test(email)) {
                  newErrors.email = 'Please enter a valid email address.';
                } else {
                  delete newErrors.email;
                }
                setErrors(newErrors);
              }}
              required
              aria-label="Email or Username"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-400"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition duration-200 ease-in-out"
                placeholder="••••••••"
                required
                aria-label="Password"
              />
              {/* Show/Hide Password Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-indigo-400 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-6 w-6" />
                ) : (
                  <EyeIcon className="h-6 w-6" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition duration-200"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transform transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
            >
              Login
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-8 text-sm text-center text-gray-400">
          Don’t have an account?{' '}
          <a href="/" className="font-medium text-indigo-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
};

// Default export for the App
export default Login;
