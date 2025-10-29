import Stripe from 'stripe';
import Order from '../models/orderModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe payment intent
// @route   POST /api/stripe/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  const { amount } = req.body; // Amount should be in cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
};

// @desc    Stripe webhook handler
// @route   POST /api/stripe/webhook
// @access  Public
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    // Use req.body (the raw body)
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    console.log('PaymentIntent Succeeded:', paymentIntent.id);

    // This is a backup. The client *should* create the order.
    // But if it fails, this webhook can be used to update the order status
    // or create the order if it doesn't exist (requires more logic, e.g., passing metadata).
    
    // For now, we'll just find an order with this paymentIntentId and mark it as paid
    // if it's somehow still 'pending'.
    
    const order = await Order.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id, paymentStatus: 'pending' },
      { paymentStatus: 'paid', status: 'pending' }, // Set status to 'pending' to start kitchen flow
      { new: true }
    );
    
    if (order) {
      console.log(`Webhook updated order ${order._id} to paid.`);
      // Emit event to admins that a new order has been confirmed
      req.io.emit('new_order', order);
    } else {
      console.log(`Webhook received for ${paymentIntent.id}, but no matching 'pending' order found.`);
    }

  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

export { createPaymentIntent, handleStripeWebhook };
