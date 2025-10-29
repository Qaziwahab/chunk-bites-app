import React, { useState, useEffect, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';

// Get Socket.io URL from environment variables
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
let socket;

// Define the steps for the tracker
const STATUS_STEPS = {
  Pending: 1,
  Preparing: 2,
  'Out for Delivery': 3,
  Delivered: 4,
};
const STEPS_ARRAY = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

const OrderTracking = () => {
  const { orderId } = useParams(); // Get order ID from the URL
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Fetch the initial order details
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/orders/${orderId}`);
        setOrder(data.order);
        setError(null);
      } catch (err) {
        setError('Could not find order.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // 2. Set up Socket.io connection
    // We connect to the server (running on our VITE_SOCKET_URL)
    socket = io(SOCKET_URL);

    // 3. Join the "room" for this specific order
    // This tells the server "I am interested in updates for this order"
    socket.emit('joinOrderRoom', orderId);

    // 4. Listen for "orderStatusUpdated" event from the server
    socket.on('orderStatusUpdated', (updatedOrder) => {
      // When we get an update, update our local state
      setOrder((prevOrder) => ({ ...prevOrder, status: updatedOrder.status }));
    });

    // 5. Clean up when the component unmounts
    return () => {
      // Leave the room and disconnect the socket
      socket.emit('leaveOrderRoom', orderId);
      socket.disconnect();
    };
  }, [orderId]);

  if (loading) {
    return <p className="text-center p-12">Loading order details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 p-12">{error}</p>;
  }

  // Security check: Only let the user who placed the order see it
  if (!user || (order && order.user._id !== user._id)) {
    return <Navigate to="/" replace />;
  }

  const currentStep = STATUS_STEPS[order.status] || 1;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-xl p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Order Tracking
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Order ID: <span className="font-medium text-gray-900">{order._id}</span>
          </p>
          <p className="text-2xl font-bold text-orange-600 mb-8">
            Status: {order.status}
          </p>

          {/* Visual Status Tracker */}
          <div className="my-10">
            <h2 className="sr-only">Steps</h2>
            <div className="relative">
              {/* Connecting line */}
              <div
                className="absolute left-0 top-1/2 -mt-px h-0.5 w-full bg-gray-300"
                aria-hidden="true"
              />
              <div
                className="absolute left-0 top-1/2 -mt-px h-0.5 bg-orange-600"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              <div className="relative flex justify-between">
                {STEPS_ARRAY.map((step, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = currentStep > stepNumber;
                  const isCurrent = currentStep === stepNumber;

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center z-10"
                    >
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white
                          ${
                            isCompleted
                              ? 'bg-orange-600'
                              : isCurrent
                              ? 'bg-orange-600 ring-2 ring-orange-200'
                              : 'bg-gray-300'
                          }
                        `}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-5 h-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-white' : 'text-gray-600'
                            }`}
                          >
                            {stepNumber}
                          </span>
                        )}
                      </span>
                      <span className="mt-2 text-sm font-medium text-center text-gray-700">
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={item.product._id} className="flex justify-between">
                  <span className="text-gray-700">
                    {item.quantity} x {item.product.name}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(item.quantity * item.product.price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center text-xl font-bold border-t border-gray-200 mt-6 pt-6">
              <span>Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

