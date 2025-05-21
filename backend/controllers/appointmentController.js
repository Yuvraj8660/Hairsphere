const Appointment = require('../models/appointmentModel');
const Salon = require('../models/salonModel');

exports.bookAppointment = async (req, res) => {
  const {
    salonId,
    customerInfo,   // { name, phone, gender }
    appointment,    // { date, time }
    services,       // array of service names or IDs
    total           // total amount
  } = req.body;
  //console.log("Received req.body:", req.body);
  try {
    const newAppointment = new Appointment({
      salonId,
      customerInfo,
      appointment,
      services,
      //status: "Pending", // Default status
      total
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!"
    });
  } catch (err) {
    //console.error("Error booking appointment:", err);
    res.status(500).json({
      success: false,
      message: "Booking failed....",
      error: err.message
    });
  }
};
/*
exports.getAppointmentsForOwner = async (req, res) => {
  const { ownerId } = req.params;

  try {
    const salons = await Salon.find({ owner: ownerId });
    const salonIds = salons.map(s => s._id);

    const appointments = await Appointment.find({ salon: { $in: salonIds } })
      .populate("user")
      .populate("service")
      .sort({ date: 1 });

    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching appointments", error: err.message });
  }
};


exports.getAppointmentsForOwner = async (req, res) => {
    const { ownerId } = req.params;
    const { status } = req.query;
  
    try {
      const salons = await Salon.find({ owner: ownerId });
      const salonIds = salons.map(s => s._id);
  
      let query = { salon: { $in: salonIds } };
      if (status && status !== "all") {
        query.status = status;
      }
  
      const appointments = await Appointment.find(query)
        .populate("user")
        .populate("service")
        .sort({ date: 1 });
  
      res.json({ success: true, appointments });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  */


 /* const Appointment = require('../models/appointmentModel');
const Salon = require('../models/salonModel');

exports.bookAppointment = async (req, res) => {
  const {
    salonId,
    customerInfo,   // { name, phone, gender }
    appointment,    // { date, time }
    services,       // array of service names or IDs
    total           // total amount
  } = req.body;
  
  try {
    const newAppointment = new Appointment({
      salonId,
      customerInfo,
      appointment,
      services,
      total
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Booking failed",
      error: err.message
    });
  }
};
*/
exports.getAppointmentsForOwner = async (req, res) => {
  try {
    // Fetch all appointments from the collection
    const appointments = await Appointment.find().sort({ "appointment.date": 1, "appointment.time": 1 });

    res.json({ 
      success: true, 
      appointments 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching appointments", 
      error: err.message 
    });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    // Validate status
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'Pending', 'Confirmed', or 'Cancelled'"
      });
    }

    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      appointment: updatedAppointment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: err.message
    });
  }
};