import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">Chunk Bites</h3>
            <p className="text-sm">
              Delicious food delivered right to your door. Fast, fresh, and full of flavor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-bold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-light">Home</Link></li>
              <li><Link to="/menu" className="hover:text-primary-light">Menu</Link></li>
              <li><Link to="/profile" className="hover:text-primary-light">My Account</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-heading font-bold text-white mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-light">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-light">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Chunk Bites. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
