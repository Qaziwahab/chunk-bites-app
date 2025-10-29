import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutPage from '../../pages/CheckoutPage';

// Get the Stripe publishable key from the .env file
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

/**
 * StripeWrapper is a component that wraps the main checkout page.
 * Its only job is to load the Stripe.js library and provide the
 * <Elements> context to the rest of the app.
 *
 * We also create the payment intent on the backend here and pass the
 * client secret down to the checkout page.
 */
const StripeWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      {/* CheckoutPage is the component that will contain the actual checkout form */}
      <CheckoutPage />
    </Elements>
  );
};

export default StripeWrapper;

