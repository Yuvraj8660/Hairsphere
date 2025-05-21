const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
  name: String,
  price: Number,
  time: String,
  salon: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon' },
});
module.exports = mongoose.model('Service', serviceSchema);

