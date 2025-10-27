const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db.config");

dotenv.config();
console.log('Is MONGO_URI loaded?', process.env.MONGO_URI);
const app = express();

// Create config folder and db config first
connectDB();

// Middlewares
app.use(cors()); // enabling Cross-Over Resourse Sharing
app.use(express.json()); // allow the app to accept JSON data

// a simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
