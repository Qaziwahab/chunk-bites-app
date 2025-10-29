import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';

// Import Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- CORS Configuration ---
// This is critical for connecting Netlify to Render
const allowedOrigins = [
  process.env.CLIENT_URL, // Your Netlify URL (e.g., https://chunk-bites.netlify.app)
  'http://localhost:5173',  // For local development
  'http://localhost:3000',  // For local development (just in case)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies
}));

// --- Stripe Webhook ---
// Stripe requires the raw body, so this must be BEFORE express.json()
// We'll apply express.json() only to other routes.
app.use(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' })
);

// Body parser
app.use(express.json());

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Chunk Bites API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stripe', stripeRoutes);

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

// --- Server & Socket.io Setup ---
const PORT = process.env.PORT || 10000; // Use Render's port

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a room based on order ID
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(orderId);
    console.log(`Socket ${socket.id} joined room ${orderId}`);
  });

  // Listen for status updates from admin
  socket.on('updateOrderStatus', ({ orderId, status }) => {
    // Emit the update to all clients in that order's room
    io.to(orderId).emit('orderStatusUpdated', { orderId, status });
    console.log(`Order ${orderId} status updated to ${status}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// --- AppListen ---
// We need to pass io to the req object so our controllers can use it
// This is a simple way to make `io` globally available in controllers
app.set('socketio', io);

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

