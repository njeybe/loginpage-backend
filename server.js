const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

dotenv.config();

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
app.use("/api/auth/", authRoutes);

// Error Handling Middlewares pwedeng wala per mas okay kung meron
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
