const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("./userModel");


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, "my_Secret_key", { expiresIn: "30d" });
  };

//register token döndürmesin ve giriş mail üzerinden olmayacaka sonra düzelt
  const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }
  
    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
  
    // create hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
  
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  });
  
  const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }
  
    // Check for user email
    const user = await User.findOne({ email });
  
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  });
  
  const getLoggedInUser = asyncHandler(async (req, res) => {
    const { _id, name, email } = await User.findById(req.user.id);
    res.status(200).json({
      id: _id,
      name,
      email,
    });
  });
  
  module.exports = {
    registerUser,
    loginUser,
    getLoggedInUser,
  };
  