const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, unique: true, required: true },
    location: { type: String, required: true },
    gender: { type: String, required: true },
    name: { type: String, required: true },
  });
  
module.exports = mongoose.model('User', userSchema);
