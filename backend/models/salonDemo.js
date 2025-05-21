const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    name: String,
    /*avatar: String*/
  },
  rating: Number,
  date: String, // You can also use `Date` type if storing ISO dates
  content: String,
  photos: [String]
});

const ServiceSchema = new mongoose.Schema({
  name: String,
  duration: String,
  price: Number
});

/*const BadgeSchema = new mongoose.Schema({
  icon: String,
  text: String
});*/

const workingDaysSchema = new mongoose.Schema({
  day: String,
  open: String,
  close: String,
  isClosed: Boolean
});

/*const SimilarSalonSchema = new mongoose.Schema({
  id: String,
  name: String,
  image: String,
  rating: Number,
  price: String
});*/

const SalonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  salonName: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
  address: String,
  rating: Number,
  price: String,
  images: [String],
  //badges: [BadgeSchema],
  services: [ServiceSchema],
  workingDays: [workingDaysSchema],
  reviews: [ReviewSchema]
  //similarSalons: [SimilarSalonSchema]
});

module.exports = mongoose.model('SalonDemo', SalonSchema);
