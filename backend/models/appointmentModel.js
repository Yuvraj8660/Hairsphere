const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  salonId: {
    type: String,
    //required: true
  },
  customerInfo: {
    name: {
      type: String,
     // required: true
    },
    phone: {
      type: String,
      //required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other','male','female','other'],
      //required: true
    }
  },
  appointment: {
    date: {
      type: String, // You could use Date type if it's a full ISO date string
      //required: true
    },
    time: {
      type: String,
      //required: true
    }
  },
  services: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  total: {
    type: Number,
    required: true
  }
}, 
{ timestamps: true }
); // adds createdAt and updatedAt

module.exports = mongoose.model('Appointment', appointmentSchema);
