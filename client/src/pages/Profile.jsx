import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return; // Wait for user to be loaded

      try {
        setLoading(true);
        // Fetch orders for the currently logged-in user
        const { data } = await axiosInstance.get(`/users/${user._id}/orders`);
        setOrders(data.orders);
        setError(null);
      } catch (err) {
        setError('Could not fetch order history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]); // Re-run when user is available

  if (!user) {
    return <p className="text-center p-12">Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white shadow-xl rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Hi, {user.name}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">{user.email}</p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200"
          >
            Logout
          </button>
        </div>

        {/* Order History */}
        <div className="bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Order History
          </h2>
          {loading && <p>Loading orders...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order ID: {order._id}
                        </p>
                        <p className="text-lg font-semibold">
                          Total: ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                          ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        `}
                      >
                        {order.status}
                      </span>
                    </div>
                    <ul className="mb-4 space-y-2">
                      {order.items.map((item) => (
                        <li
                          key={item.product._id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-800">
                            {item.quantity} x {item.product.name}
                          </span>
                          <span className="text-gray-600">
                            ${(item.quantity * item.product.price).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-orange-600 hover:text-orange-500 font-medium"
                    >
                      Track Order &rarr;
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  You haven't placed any orders yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

