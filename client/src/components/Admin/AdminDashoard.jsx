import React, { useState } from 'react';
import ManageProducts from '../../components/Admin/ManageProducts';
import ManageOrders from '../../components/Admin/ManageOrders';

// A simple tab component
const Tab = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-3 font-medium text-sm rounded-t-lg focus:outline-none transition-all duration-300
      ${
        isActive
          ? 'border-b-4 border-orange-500 text-orange-600'
          : 'text-gray-500 hover:text-gray-800'
      }
    `}
    onClick={onClick}
  >
    {label}
  </button>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <Tab
              label="Manage Orders"
              isActive={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
            />
            <Tab
              label="Manage Products"
              isActive={activeTab === 'products'}
              onClick={() => setActiveTab('products')}
            />
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Active Orders
              </h2>
              <ManageOrders />
            </div>
          )}
          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Product Catalog
              </h2>
              <ManageProducts />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

