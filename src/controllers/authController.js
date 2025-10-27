const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registeredUser = async (req, res, next) => {
  try {
    // 1. Get user data from request body
    const { name, email, password } = req.body;

    // 2. Check if user already exists in the database
    let user = await User.findOne({ email });

    // 3. If user exists, send a 400 (Bad Request) response
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // 4. If user is new, create a new User instance
    user = new User({
      name,
      email,
      password,
    });

    // 5. Save the user to the database
    // Note: The password hashing is handled by the 'pre-save' hook
    // in your 'src/models/User.js' file before this save operation.
    await user.save();

    // 6. Send a 201 (Created) success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });

  } catch (err) {
    // Handle any server errors
    console.error('Error during registration:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res, next) => {
  try {
    // 1. Get login credentials from request body
    const { email, password } = req.body;

    // 2. Check if user exists
    // We must .select('+password') because the model has 'select: false'
    const user = await User.findOne({ email }).select('+password');

    // 3. If no user is found, send 400 (Bad Request)
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Compare the entered password with the hashed password in the database
    // We use the 'matchPassword' method you defined on your User model
    const isMatch = await user.matchPassword(password);

    // 5. If passwords don't match, send 400 (Bad Request)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // 6. If credentials are correct, create a JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your secret key from .env
      {
        expiresIn: '1h', // Token expires in 1 hour
      },
      (err, token) => {
        if (err) throw err;
        
        // 7. Send the token back to the client
        res.status(200).json({
          success: true,
          token: token,
        });
      }
    );

  } catch (err) {
    // Handle any server errors
    console.error('Error during login:', err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

