import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import StripeWrapper from '../components/Checkout/StripeWrapper';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const CheckoutPage = () => {
  const { cart, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const total = getCartTotal();

  useEffect(() => {
    if (!user) {
      // User must be logged in to check out
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (cart.length === 0) {
      // Can't check out with an empty cart
      navigate('/menu');
      return;
    }

    // 1. Create a Payment Intent on the server
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.post('/stripe/create-payment-intent', {
          // Send item IDs and quantities, server will calculate total
          items: cart.map(item => ({ id: item.product._id, quantity: item.quantity }))
        });

        // 2. Get the clientSecret from the server's response
        setClientSecret(data.clientSecret);
        setError(null);
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Could not initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [cart, user, navigate, total]);

  if (!user) return null; // We are redirecting, so this just prevents flicker

  if (cart.length === 0) return null; // Redirecting...

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Checkout
        </h1>

        <div className="bg-white shadow-xl rounded-xl p-8">
          {/* Cart Summary */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Order
            </h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <img
                      src={item.product.image || 'https://placehold.co/100'}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <hr className="my-6" />
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Stripe Payment Form */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Details
            </h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            {loading && <p className="text-center">Loading payment form...</p>}

            {/* If we have a clientSecret, render the Stripe form */}
            {clientSecret && (
              <StripeWrapper clientSecret={clientSecret} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

