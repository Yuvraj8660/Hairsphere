const User = require('../models/userModel');

exports.registerUser = async (req, res) => {
  const { name, gender, location, phone } = req.body;

  if (!name || !gender || !location || !phone) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
     // return res.status(400).json({ success: false, error: { code: 'USER_EXISTS', message: "User already exists" } });

    }

    const newUser = new User({ name, gender, location, phone });
    await newUser.save();
    //console.log("Received req.body:", req.body);

    res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
    //console.log("Registering user with data:", { name, gender, location, phone });

  } catch (err) {
    
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};
