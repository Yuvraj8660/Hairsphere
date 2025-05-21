const Service = require('../models/serviceModel');

exports.addService = async (req, res) => {
  const { name, price, time, salonId } = req.body;

  try {
    const newService = new Service({
      name,
      price,
      time,
      salon: salonId,
    });

    await newService.save();
    res.status(201).json({ success: true, message: "Service added successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding service", error: err.message });
  }
};
