const Salon = require('../models/salonModel');
const Owner = require('../models/ownerModel');

/*exports.registerSalon = async (req, res) => {
  const { salonName, address, workingDays, timing, ownerId } = req.body;

  try {
    const newSalon = new Salon({
      salonName,
      address,
      workingDays,
      timing,
      owner: ownerId,
    });

    const savedSalon = await newSalon.save();

    // Update owner with salon reference
    await Owner.findByIdAndUpdate(ownerId, { salon: savedSalon._id });

    res.status(201).json({ success: true, salon: savedSalon });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};*/
const fetch = require('node-fetch'); // already imported

exports.registerSalon = async (req, res) => {
  const { salonName, address, workingDays, timing, ownerId } = req.body;

  //try {
    // STEP 1: Geocode using Nominatim
    //const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    //const geoData = await geoRes.json();
    //if (!geoData || geoData.length === 0) {
      //return res.status(400).json({ success: false, message: "Address not found." });
    //}
    //const lat = parseFloat(geoData[0].lat);
    //const lon = parseFloat(geoData[0].lon);

    // STEP 2: Create salon with location
    const newSalon = new Salon({
      salonName,
      address,
      workingDays,
      timing,
      owner: ownerId,
      //location: {
        //type: 'Point',
        //coordinates: [lat, lon]
      //}
    });

    const savedSalon = await newSalon.save();

    // STEP 3: Update owner
    await Owner.findByIdAndUpdate(ownerId, { salon: savedSalon._id });

    res.status(201).json({ success: true, salon: savedSalon });
  } //catch (err) {
    //res.status(500).json({ success: false, error: err.message });
 // }
//};


/*exports.getNearbySalons = async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const salons = await Salon.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 5000 // 5 KM
        }
      }
    });

    res.json(salons);
  } catch (error) {
    console.error('Nearby salon error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby salons' });
  }
};


//const fetch = require('node-fetch');

/*exports.geocodeAndSaveLocation = async (req, res) => {
  const { address, salonId } = req.body;
  const apiKey = 'AIzaSyAY5liEFd3PDux3qxgF7jNiF-pP4vBFuKA'; // Replace this with your real key
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await fetch(geocodeUrl);
    const data = await response.json();
    const location = data.results[0].geometry.location;

    await Salon.findByIdAndUpdate(salonId, {
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      }
    });

    res.status(200).json({ success: true, coordinates: location });
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ success: false, error: 'Failed to geocode address' });
  }
};

/*
exports.getNearbySalons = async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const salons = await Salon.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 5000 // 5 km
        }
      }
    });

    res.json(salons);
  } catch (error) {
    console.error('Nearby salon error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby salons' });
  }
};
*/
