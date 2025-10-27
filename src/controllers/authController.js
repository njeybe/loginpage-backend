const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return (
    jwt.sign({ id }),
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

exports.registeredUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: email._id,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: email._id,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid emaol and password " });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
};
