/*const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointmentsForOwner } = require('../controllers/appointmentController');

router.post('/book', bookAppointment);
router.get('/owner/:ownerId', getAppointmentsForOwner); // to show on dashboard

module.exports = router;

router.patch('/status/:id', async (req, res) => {
    try {
      const { status } = req.body;
      await Appointment.findByIdAndUpdate(req.params.id, { status });
      res.json({ success: true, message: "Status updated." });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  
  router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const { status } = req.query;
  
    try {
      let query = { user: userId };
      if (status && status !== "all") {
        query.status = status;
      }
  
      const appointments = await Appointment.find(query)
        .populate("salon")
        .populate("service")
        .sort({ date: 1 });
  
      res.json({ success: true, appointments });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  //const express = require('express');
//const router = express.Router();
//const appointmentController = require('../controllers/appointmentController');

// Book a new appointment
router.post('/', appointmentController.bookAppointment);

// Get appointments for a salon owner
router.get('/owner/:ownerId', appointmentController.getAppointmentsForOwner);

// Update appointment status
router.put('/:appointmentId/status', appointmentController.updateAppointmentStatus);

module.exports = router;*/


const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
 
// Book a new appointment
router.post('/book', appointmentController.bookAppointment); 

// Get appointments for a salon owner
router.get('/', appointmentController.getAppointmentsForOwner);

// Update appointment status
router.put('/:appointmentId/status', appointmentController.updateAppointmentStatus);

module.exports = router;