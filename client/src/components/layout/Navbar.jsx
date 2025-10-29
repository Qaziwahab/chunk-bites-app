import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

// Icon components for cleaner JSX
const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navLinkClasses =
    'text-gray-700 hover:text-orange-600 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium';
  const mobileNavLinkClasses =
    'block text-gray-700 hover:text-orange-600 transition-colors duration-200 px-3 py-2 rounded-md text-base font-medium';

  const authLinks = (
    <>
      {user?.isAdmin && (
        <Link to="/admin/dashboard" className={navLinkClasses}>
          Admin
        </Link>
      )}
      <Link to="/profile" className={navLinkClasses}>
        Profile
      </Link>
      <button onClick={handleLogout} className={navLinkClasses}>
        Logout
      </button>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/login" className={navLinkClasses}>
        Login
      </Link>
      <Link
        to="/register"
        className="ml-2 text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg"
      >
        Sign Up
      </Link>
    </>
  );

  const mobileAuthLinks = (
    <>
      {user?.isAdmin && (
        <Link to="/admin/dashboard" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
          Admin
        </Link>
      )}
      <Link to="/profile" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
        Profile
      </Link>
      <button onClick={handleLogout} className={`${mobileNavLinkClasses} w-full text-left`}>
        Logout
      </button>
    </>
  );

  const mobileGuestLinks = (
    <>
      <Link to="/login" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
        Login
      </Link>
      <Link
        to="/register"
        className="block w-full text-center text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 px-4 py-2 rounded-full text-base font-medium shadow-md hover:shadow-lg"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Sign Up
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo and Main Nav */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 text-2xl font-bold text-orange-600"
            >
              Chunk Bites
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={navLinkClasses}>
                  Home
                </Link>
                <Link to="/menu" className={navLinkClasses}>
                  Menu
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Auth and Cart */}
          <div className="hidden md:flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative text-gray-600 hover:text-orange-600 p-2 rounded-full transition-colors duration-200"
                aria-label="View shopping cart"
              >
                <CartIcon />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0 right-0 block h-5 w-5 -mt-1 -mr-1 text-xs text-white bg-red-500 rounded-full flex items-center justify-center font-bold"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Auth Links */}
              <div className="ml-3 relative">{user ? authLinks : guestLinks}</div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <Link
                to="/cart"
                className="relative text-gray-600 hover:text-orange-600 p-2 rounded-full transition-colors duration-200 mr-2"
                aria-label="View shopping cart"
              >
                <CartIcon />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0 right-0 block h-5 w-5 -mt-1 -mr-1 text-xs text-white bg-red-500 rounded-full flex items-center justify-center font-bold"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            id="mobile-menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/menu" className={mobileNavLinkClasses} onClick={() => setIsMobileMenuOpen(false)}>
                Menu
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-2 space-y-2">
                {user ? mobileAuthLinks : mobileGuestLinks}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

