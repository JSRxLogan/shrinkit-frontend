import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * @component Header
 * @description A responsive header component with navigation and a logout button.
 * It adapts for mobile and desktop screens.
 */
const Header = () => {
  // State to manage the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Toggles the mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handles the logout functionality
  const handleLogout = async () => {
    try {
      const res=await axios.get(`${API_BASE_URL}/api/auth/logout`);
      // In a real application, you would likely redirect the user
      // to the login page or update the application's auth state here.
      const redirectTo = res.data.redirectTo || '/login';
      console.log('Logout successful!');
      navigate(redirectTo); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo */}
          <div className="flex-shrink-0">
            <Link to="/home" className="text-4xl font-bold text-white hover:text-cyan-400 transition-colors duration-300">
              ShrinkIt
            </Link>
          </div>

          {/* Center Section: Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/home"
              className="px-3 py-2 rounded-md text-2xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/my-urls"
              className="px-3 py-2 rounded-md text-2xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              My URLs
            </Link>
          </div>

          {/* Right Section: Desktop Logout Button */}
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="flex items-center p-2 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all duration-300"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile: Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/home"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/my-urls"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              My URLs
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:bg-gray-700 hover:text-cyan-300 transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;