// Load environment variables
require('dotenv').config();

// Import express module
const express = require('express');

// Import the MongoDB connection function
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Create express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Mount the user routes
app.use('/api/users', require('./routes/userRoutes'));

// Define a simple route for GET /
app.get('/', (req, res) => {
  res.send('Hello World! Your server is running.');
});

// Choose a port number
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});