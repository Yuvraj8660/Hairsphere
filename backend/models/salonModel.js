const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  salonName: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
  address: String,
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  workingDays: [String],
  timing: String,
  /*location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: ['Point'], // [longitude, latitude]
      index: '2dsphere'
    }
  },*/
  
});

module.exports = mongoose.model('Salon', salonSchema);

/*const mongoose = require('mongoose');

// Define the salon schema
const salonSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    type: { type: String, default: 'Point' }, // Geospatial point type
    coordinates: { type: [Number], required: true },  // Array [longitude, latitude]
  },
});

// Create an index for geospatial search
salonSchema.index({ location: '2dsphere' });

const Salon = mongoose.model('Salon', salonSchema);

module.exports = Salon;*/
