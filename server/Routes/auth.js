const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Account = require('../models/Account');
const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  console.log("API Call: /api/auth/signup");
  try {
    const { username, password, email, mobileNumber, name, address, contactNumber, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { mobileNumber }],
    });

    if (existingUser) {
      let message = "Username";
      if (existingUser.email === email) message += " and email";
      if (existingUser.mobileNumber === mobileNumber) message += " and mobile number";
      message += " already exists";
      console.log("Error: ", message);
      return res.status(400).json({ message });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      mobileNumber,
    });

    const savedUser = await newUser.save();

    // Create new customer with the saved user ID
    const newCustomer = new Customer({
      userId: savedUser._id,
      name,
      email,
      address,
      mobileNumber,
      dateOfBirth,
    });

    const savedCustomer = await newCustomer.save();

    // Create a new account for the customer
    const newAccount = new Account({
      customerId: savedCustomer._id,
      balance: 0
    });

    await newAccount.save();

    res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
      customer: savedCustomer,
      account: newAccount
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Update Address Route
router.put("/update-address", async (req, res) => {
  console.log("API Call: /api/auth/update-address");
  try {
    const { userId, address } = req.body;

    const customer = await Customer.findOne({ userId });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.address = address;
    const updatedCustomer = await customer.save();

    res.status(200).json({
      message: "Address updated successfully",
      customer: updatedCustomer
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Error updating address" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  console.log("API Call: /api/auth/login");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const customer = await Customer.findOne({ userId: user._id });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      customerId: customer._id,
      email: user.email
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
