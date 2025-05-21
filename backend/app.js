const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const salonRoutes = require('./routes/salonRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const salonController = require('./controllers/salonController');




//app.post('/api/salons/nearby', salonController.getNearbySalons);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
//app.use('/api/salonDemo', salonDemoRoutes);

// serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// Sample route

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend','landing.html'));
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀Server running on port ${PORT}`));



