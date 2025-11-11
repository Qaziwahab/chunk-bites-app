Chunk Bites - Full Stack Food Ordering AppWelcome to Chunk Bites! This is a complete, production-ready MERN stack (MongoDB, Express, React, Node.js) food ordering application.It features a beautiful, responsive customer-facing website, a real-time admin dashboard for order management, and a secure backend with Stripe integration for payments.Live Demo: [Your Netlify URL Here]Backend API: [Your Render URL Here]FeaturesCustomer-Facing AppModern UI/UX: Beautiful, responsive design built with Tailwind CSS.Micro-interactions: Subtle hover effects and smooth transitions with Framer Motion.Menu & Cart: Browse products, add/remove items, and manage your cart with React Context.Secure Payments: Full checkout flow integrated with Stripe (in test mode).User Auth: Secure JWT (JSON Web Token) authentication for sign up, login, and profile pages.Order History: Users can view their past orders on their profile.Real-time Order Tracking: A dedicated page shows live order status updates (Pending -> Preparing -> Out for Delivery) using Socket.io.Admin DashboardProtected Routes: Admin panel is only accessible to users with an admin role.Product Management (CRUD): Admins can add, edit, and delete menu items.Live Order Management: Orders appear in the admin panel in real-time. Admins can update the order status, which instantly updates the customer's tracking page.Tech StackBackend (/server)Runtime: Node.jsFramework: Express.jsDatabase: MongoDB (with Mongoose)Authentication: JWT (JSON Web Tokens) & bcryptPayments: StripeReal-time: Socket.ioDeployment: RenderFrontend (/client)Library: React 18 (with Vite)Styling: Tailwind CSSAnimations: Framer MotionRouting: React Router DOMState Management: React Context APIAPI Calls: AxiosDeployment: NetlifyLocal Development SetupFollow these steps to get the project running on your local machine.PrerequisitesNode.js (v18 or later)npmGitA code editor (like VS Code)Part 1: Backend Setup (/server)Clone the Repository:git clone [https://github.com/](https://github.com/)[YOUR_USERNAME]/chunk-bites-app.git
cd chunk-bites-app/server
Install Dependencies:npm install
Set Up Environment Variables:Create a file named .env in the /server directory.Copy the contents of .env.example into your new .env file.Fill in the following variables:# 1. MongoDB
# Get this from MongoDB Atlas (see deployment guide)
MONGO_URI=mongodb+srv://...

# 2. JWT
# Type a long, random, secret password
JWT_SECRET=mysecretkey12345

# 3. Stripe
# Get these from your Stripe dashboard (in Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 4. Client URL
# This is for CORS. Use your local React app's URL
CLIENT_URL=http://localhost:5173
Seed the Database (Optional, but Recommended):This script will populate your database with sample menu items and an admin user.The admin user's credentials are: admin@chunkbites.com / admin123Important: Make sure your MONGO_URI is correct in your .env file before running.npm run seed
Start the Backend Server:This will run the server on http://localhost:10000 (or your PORT variable).npm run dev
Part 2: Frontend Setup (/client)Open a New Terminal and navigate to the /client directory:cd ../client
Install Dependencies:npm install
Set Up Environment Variables:Create a file named .env in the /client directory.Copy the contents of .env.example into your new .env file.Fill in the following variables:# 1. API URL
# This is the URL of your local backend server
VITE_API_URL=http://localhost:10000/api

# 2. Socket.io URL
# This is the base URL of your local backend server
VITE_SOCKET_URL=http://localhost:10000

# 3. Stripe
# Get this from your Stripe dashboard (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
Start the Frontend App:This will run the React app on http://localhost:5173.npm run dev
Your app should now be running! Open http://localhost:5173 in your browser.DeploymentThis project is configured for a professional, "split" deployment:Backend API on Render (as a Web Service)Frontend App on Netlify (as a Static Site)For detailed, step-by-step instructions, see:RENDER_INSTRUCTIONS.mdNETLIFY_INSTRUCTIONS.mdDEPLOYMENT_STEPS.txt (Quick Checklist)Final Checklist Before Going Live[ ] Create a production MongoDB Atlas database and get the MONGO_URI.[ ] Add your Render server's IP to the MongoDB Atlas "Network Access" list.[ ] Set all environment variables on Render (using the live Netlify URL for CLIENT_URL).[ ] Set all environment variables on Netlify (using the live Render URL for VITE_API_URL and VITE_SOCKET_URL).[ ] Add your live Stripe keys (not test keys) to Render and Netlify.[ ] Set up your Stripe Webhook to point to your live Render API: https://your-render-app.onrender.com/api/stripe/webhook.[ ] Run the npm run seed command one time locally, but connected to your live MongoDB database to populate your live app with data. (Remember to delete the .env file with your live URI afterward!
