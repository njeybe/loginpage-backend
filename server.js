const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = "../config/db.config";

dotenv.config();

const app = express();

connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  req.setEncoding("API is running...");
});
