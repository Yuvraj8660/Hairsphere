const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

/*router.post('/check-phone', async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (user) {
      return res.json({ exists: true, userId: user._id });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});*/

router.post('/check-phone/owner', async (req, res) => {
  const { phone } = req.body;
  const Owner = require('../models/ownerModel');
  //const User = require('../models/userModel'); // if needed

  try {
    const owner = await Owner.findOne({ number: phone });
    if (owner) {
      return res.json({ exists: true, role: 'owner' , ownerId: owner._id });
    }

    // optionally check for user
    return res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const { checkPhoneExists } = require('../controllers/authController');

router.post('/check-phone',checkPhoneExists);

module.exports = router;
