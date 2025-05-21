
const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: String,
  number: { type: String, unique: true },
  salon: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon' },
});

module.exports = mongoose.model('Owner', ownerSchema);
