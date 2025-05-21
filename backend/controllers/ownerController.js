const Owner = require('../models/ownerModel');

exports.registerOwner = async (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const existing = await Owner.findOne({ number });
    if (existing) {
      return res.status(400).json({ success: false, message: "Owner already exists" });
    }

    const newOwner = new Owner({ name, number });
    await newOwner.save();

    res.status(201).json({ success: true, owner: newOwner });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
