import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// Load env vars
dotenv.config({ path: 'server/.env' });

// Connect to DB
connectDB();

const sampleProducts = [
  {
    name: 'Classic Cheese Burger',
    description:
      'A juicy 100% beef patty with melted cheddar cheese, lettuce, tomato, onions, pickles, and our special sauce on a toasted sesame seed bun.',
    price: 12.99,
    category: 'Burgers',
    imageUrl:
      'https://placehold.co/600x400/F2994A/FFFFFF?text=Cheese+Burger',
    ingredients: ['Beef Patty', 'Cheddar Cheese', 'Lettuce', 'Tomato', 'Onion'],
    calories: 750,
  },
  {
    name: 'Spicy Pepperoni Pizza',
    description:
      'Large 14-inch pizza with a zesty tomato sauce, mozzarella cheese, and a generous topping of spicy pepperoni slices.',
    price: 18.99,
    category: 'Pizza',
    imageUrl: 'https://placehold.co/600x400/EB5757/FFFFFF?text=Pizza',
    ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Pepperoni'],
    calories: 2100,
  },
  {
    name: 'Fresh Garden Salad',
    description:
      'A mix of fresh romaine lettuce, cherry tomatoes, cucumbers, red onions, and bell peppers. Served with your choice of dressing.',
    price: 9.99,
    category: 'Salads',
    imageUrl: 'https://placehold.co/600x400/27AE60/FFFFFF?text=Salad',
    ingredients: [
      'Romaine Lettuce',
      'Cherry Tomatoes',
      'Cucumbers',
      'Red Onions',
    ],
    calories: 250,
  },
  {
    name: 'Chocolate Lava Cake',
    description:
      'A decadent warm chocolate cake with a gooey molten chocolate center. Served with a scoop of vanilla ice cream.',
    price: 8.99,
    category: 'Desserts',
    imageUrl: 'https://placehold.co/600x400/6F4E37/FFFFFF?text=Lava+Cake',
    ingredients: ['Chocolate', 'Flour', 'Sugar', 'Butter', 'Vanilla Ice Cream'],
    calories: 600,
  },
  {
    name: 'Crispy Chicken Tenders',
    description:
      'Five all-white meat chicken tenders, breaded and fried to a golden crisp. Served with honey mustard or BBQ sauce and a side of fries.',
    price: 11.99,
    category: 'Main Courses',
    imageUrl: 'https://placehold.co/600x400/F2C94C/FFFFFF?text=Chicken',
    ingredients: ['Chicken Breast', 'Breadcrumbs', 'Fries', 'Sauce'],
    calories: 950,
  },
  {
    name: 'Iced Caramel Macchiato',
    description:
      'A refreshing blend of rich espresso, creamy milk, and buttery caramel sauce, served over ice.',
    price: 5.49,
    category: 'Drinks',
    imageUrl: 'https://placehold.co/600x400/9B7B63/FFFFFF?text=Coffee',
    ingredients: ['Espresso', 'Milk', 'Caramel Sauce', 'Ice'],
    calories: 280,
  },
];

const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@chunkbites.com',
      password: hashedPassword,
      isAdmin: true,
    });

    await adminUser.save();

    // Insert sample products
    await Product.insertMany(sampleProducts);

    console.log('Data successfully imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data successfully destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

// Check for command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

