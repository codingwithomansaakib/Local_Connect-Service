const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');

// User Signup
router.post('/signup/user', async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("📥 Received signup:", req.body); 
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Provider Signup
// Corrected Provider Signup Route
router.post('/signup/provider', async (req, res) => {
  const { fullName, phone, password, service, pincode, latitude, longitude } = req.body;
  console.log("Received data:", req.body);

  try {
    if (!password) return res.status(400).json({ error: "Password is required" });

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ salt rounds = 10

    const provider = new ServiceProvider({
      fullName,
      phone,
      password: hashedPassword, // ✅ store hashed password
      service,
      pincode,
      latitude,
      longitude
    });

    await provider.save();
    res.status(201).json({ message: "Provider registered successfully!" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/test', (req, res) => {
  res.send('API is working!');
});



// Search providers by pincode
router.get('/search', async (req, res) => {
  const { service, pincode } = req.query;

  try {
    const results = await ServiceProvider.find({ service, pincode });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// user login
/*router.post('/login/user', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // ✅ Send back fullName and email
    res.json({
      message: "Login successful!",
      fullName: user.fullName,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});*/


// In routes/auth.js or wherever your routes are
router.post('/login/provider', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const provider = await ServiceProvider.findOne({ phone });
    if (!provider) return res.status(401).json({ error: "Invalid phone or password" });

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid phone or password" });

    res.json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/create-test-user", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash("123456", 10);
    const newUser = new User({
      fullName: "Test User",
      email: "testuser@example.com",
      password: hashedPassword
    });

    await newUser.save();
    res.send("Test user created ✅");
  } catch (err) {
    res.status(500).send("Error creating user: " + err.message);
  }
});





module.exports = router;
