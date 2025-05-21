const express = require('express');
const router = express.Router();
const { registerSalon } = require('../controllers/salonController');

router.post('/register', registerSalon);


  




module.exports = router;



