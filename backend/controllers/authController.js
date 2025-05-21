const admin = require('../config/firebase');
const User = require('../models/userModel');
const Owner = require('../models/ownerModel');

exports.verifyOtpToken = async (req, res) => {
  const { idToken, role } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const phone = decodedToken.phone_number;

    let user;

    if (role === 'customer') {
      user = await User.findOne({ phone });
    } else if (role === 'owner') {
      user = await Owner.findOne({ number: phone });
    }

    if (user) {
      res.status(200).json({ exists: true, user });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid OTP or Token' });
  }
};

//const User = require('../models/userModel');

exports.checkPhoneExists = async (req, res) => {
  const { phone } = req.body;
  
  try {
    const user = await User.findOne({ phone });

    if (user) {
      res.status(200).json({ exists: true, userId: user._id });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
