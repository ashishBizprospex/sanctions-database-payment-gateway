import express from "express";
import sequelize, { connectDB } from "./db/db.js";
import dotenv from "dotenv";

import paymentRoute from "./routes/paymentRoute.js";

import cors from 'cors';  // Import cors

// Initialize environment variables
dotenv.config();

// Create an instance of Express
const app = express();

// Define your allowed origins (frontend URL)
const allowedOrigins = ['http://localhost:2001','http://localhost:5173','https://api.aml-pep-data.com']; // Adjust this as needed for production

// CORS configuration
const corsOptions = {
  origin: "*", // Allow all origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200, // For older browsers (they may not handle 204 correctly)
};


app.use(cors(corsOptions));
// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Declare routes

app.use('/api/v1', paymentRoute);

// Global route for health check
app.get('/', (req, res) => {
  res.send("Hello this is the sactions data payment gateway server made by Ashish Yenurkar");
});

// Start the server only after connecting to the database
const startServer = async () => {
  try {
    await connectDB();

    // Sync the models with the database
    await sequelize.sync({ force: false });

    const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000
    app.listen(PORT, () => {
      console.log(`Server is started on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start the server due to database connection error:', err);
    process.exit(1);
  }
};

// Call the function to start the server
startServer();

