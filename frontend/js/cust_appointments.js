document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Fetch appointments data from the API
    const response = await fetch('http://localhost:5000/api/appointments/');
    if (!response.ok) {
      throw new Error(`Failed to fetch appointments: ${response.statusText}`);
    }
    const appointmentsData = await response.json();

    // List of salon image URLs
    const salonImageUrls = [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      "https://images.unsplash.com/photo-1635033487963-1c320e92f578",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70"
    ];

    // Preprocess the data to make it compatible with the frontend
    const processedAppointments = appointmentsData.appointments.map(appt => ({
      id: appt._id,
      salonName: "Glamour Hair & Beauty", // Placeholder, as salonName is not in the API response
      salonImage: salonImageUrls[Math.floor(Math.random() * salonImageUrls.length)], // Random salon image
      salonAddress: "50 Sector B,indore, Madhya Pradesh", // Placeholder, as salonAddress is not in the API response
      salonPhone: "9109075767", // Placeholder, as salonPhone is not in the API response
      date: appt.appointment.date,
      time: appt.appointment.time,
      services: appt.services.map(service => ({
        ...service,
        duration: "30 min" // Placeholder, as duration is not in the API response
      })),
      status: appt.status.toLowerCase(), // Convert status to lowercase for consistency
      totalAmount: appt.total, // Map total to totalAmount
      stylist: "Sanjay Verma", // Placeholder, as stylist is not in the API response
      notes: "", // Placeholder, as notes are not in the API response
      cancellationReason: "" // Placeholder, as cancellationReason is not in the API response
    }));

    // Load appointments into the UI
    loadAppointments(processedAppointments, 'all');

    // Set up event listeners for filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', function () {
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        // Filter appointments
        const filter = this.getAttribute('data-filter');
        loadAppointments(processedAppointments, filter);
      });
    });
  } catch (error) {
    console.error('Error loading appointments:', error);
    alert('Failed to load appointments. Please try again later.');
  }
});

function loadAppointments(appointments, filter) {
  const appointmentsContainer = document.getElementById('appointmentsContainer');
  const emptyState = document.getElementById('emptyState');
  
  // Clear current appointments
  appointmentsContainer.innerHTML = '';
  
  // Filter appointments
  let filteredAppointments = appointments;
  if (filter !== 'all') {
    filteredAppointments = appointments.filter(appt => appt.status === filter);
  }
  
  // Show empty state if no appointments
  if (filteredAppointments.length === 0) {
    appointmentsContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  } else {
    appointmentsContainer.style.display = 'flex';
    emptyState.style.display = 'none';
  }
  
  // Sort appointments by date (newest first)
  filteredAppointments.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  // Create appointment cards
  filteredAppointments.forEach(appointment => {
    const card = createAppointmentCard(appointment);
    appointmentsContainer.appendChild(card);
  });
}

function createAppointmentCard(appointment) {
  const card = document.createElement('div');
  card.className = `appointment-card ${appointment.status}`;
  card.setAttribute('data-id', appointment.id);
  
  // Appointment status text
  let statusText = appointment.status;
  if (statusText === 'upcoming') statusText = 'Upcoming';
  else if (statusText === 'completed') statusText = 'Completed';
  else if (statusText === 'cancelled') statusText = 'Cancelled';
  
  // Calculate service duration
  const totalDuration = appointment.services.reduce((total, service) => {
    const durationMatch = service.duration.match(/(\d+)/);
    if (durationMatch) {
      return total + parseInt(durationMatch[1], 10);
    }
    return total;
  }, 0);
  
  // Format total duration to hours and minutes
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const formattedDuration = hours > 0 
    ? `${hours}h ${minutes > 0 ? minutes + 'm' : ''}` 
    : `${minutes}m`;
  
  // Create appointment header
  const header = document.createElement('div');
  header.className = 'appointment-header';
  header.innerHTML = `
    <div class="appointment-info">
      <div class="appointment-salon">${appointment.salonName}</div>
      <div class="appointment-meta">
        <div class="appointment-date">
          <i class="far fa-calendar"></i> ${appointment.date}
        </div>
        <div class="appointment-time">
          <i class="far fa-clock"></i> ${appointment.time}
        </div>
      </div>
    </div>
    <div class="appointment-status ${appointment.status}">${statusText}</div>
  `;
  card.appendChild(header);
  
  // Create appointment content (expanded details)
  const content = document.createElement('div');
  content.className = 'appointment-content';
  
  // Create appointment details
  const details = document.createElement('div');
  details.className = 'appointment-details';
  
  // Salon information section
  let salonSection = `
    <div class="details-section">
      <h3><i class="fas fa-store"></i> Salon Information</h3>
      <div class="salon-info">
        <div class="salon-image">
          <img src="${appointment.salonImage}" alt="${appointment.salonName}">
        </div>
        <div>
          <p>${appointment.salonAddress}</p>
          <div class="salon-contact">
            <a href="tel:${appointment.salonPhone}" class="salon-contact-btn">
              <i class="fas fa-phone"></i> Call
            </a>
            <a href="#" class="salon-contact-btn">
              <i class="fas fa-directions"></i> Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Appointment details section
  let appointmentSection = `
    <div class="details-section">
      <h3><i class="fas fa-info-circle"></i> Appointment Details</h3>
      <p><strong>Date & Time:</strong> ${appointment.date} at ${appointment.time}</p>
      <p><strong>Duration:</strong> ${formattedDuration}</p>
      <p><strong>Stylist:</strong> ${appointment.stylist}</p>
      ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
      ${appointment.cancellationReason ? `<p><strong>Cancellation Reason:</strong> ${appointment.cancellationReason}</p>` : ''}
    </div>
  `;
  
  // Services section
  let servicesSection = `
    <div class="details-section">
      <h3><i class="fas fa-cut"></i> Services</h3>
      <div class="service-list">
  `;
  
  // Add each service
  appointment.services.forEach(service => {
    servicesSection += `
      <div class="service-item">
        <div>
          <div class="service-name">${service.name}</div>
          <div class="service-duration">${service.duration}</div>
        </div>
        <div class="service-price">$${service.price.toFixed(2)}</div>
      </div>
    `;
  });
  
  // Close service list and add price summary
  servicesSection += `
      </div>
      <div class="price-summary">
        <div class="price-row">
          <span>Subtotal</span>
          <span>$${appointment.services.reduce((total, service) => total + service.price, 0).toFixed(2)}</span>
        </div>
        ${appointment.taxAmount ? `
        <div class="price-row">
          <span>Tax</span>
          <span>$${appointment.taxAmount.toFixed(2)}</span>
        </div>
        ` : ''}
        ${appointment.discountAmount ? `
        <div class="price-row">
          <span>Discount</span>
          <span>-$${appointment.discountAmount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div class="price-row total">
          <span>Total</span>
          <span>$${appointment.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
  
  // Action buttons based on appointment status
  let actionsSection = '';
  if (appointment.status === 'upcoming') {
    actionsSection = `
      <div class="appointment-actions">
        <button class="action-btn secondary" onclick="rescheduleAppointment('${appointment.id}')">
          <i class="fas fa-calendar-alt"></i> Reschedule
        </button>
        <button class="action-btn danger" onclick="cancelAppointment('${appointment.id}')">
          <i class="fas fa-times"></i> Cancel
        </button>
      </div>
    `;
  } else if (appointment.status === 'completed') {
    actionsSection = `
      <div class="appointment-actions">
        <button class="action-btn primary" onclick="bookSimilar('${appointment.id}')">
          <i class="fas fa-redo"></i> Book Similar
        </button>
        <button class="action-btn secondary" onclick="leaveReview('${appointment.id}')">
          <i class="fas fa-star"></i> Leave Review
        </button>
      </div>
    `;
  } else if (appointment.status === 'cancelled') {
    actionsSection = `
      <div class="appointment-actions">
        <button class="action-btn primary" onclick="rebookAppointment('${appointment.id}')">
          <i class="fas fa-redo"></i> Rebook
        </button>
      </div>
    `;
  }
  
  // Combine all sections
  details.innerHTML = salonSection + appointmentSection + servicesSection + actionsSection;
  content.appendChild(details);
  card.appendChild(content);
  
  // Add click event to header for expanding/collapsing
  header.addEventListener('click', function() {
    card.classList.toggle('expanded');
  });
  
  return card;
}

// Function to handle rebooking a cancelled appointment
function rebookAppointment(appointmentId) {
  console.log(`Rebooking appointment: ${appointmentId}`);
  // In a real app, this would open a rebooking flow or API call
  alert(`You are rebooking appointment #${appointmentId}`);
}

// Function to handle booking a similar appointment
function bookSimilar(appointmentId) {
  console.log(`Booking similar to appointment: ${appointmentId}`);
  // In a real app, this would pre-fill a booking form with similar details
  alert(`You are booking a similar appointment to #${appointmentId}`);
}

// Function to handle leaving a review
function leaveReview(appointmentId) {
  console.log(`Leaving review for appointment: ${appointmentId}`);
  // In a real app, this would open a review form
  alert(`You are leaving a review for appointment #${appointmentId}`);
}

// Function to handle rescheduling an appointment
function rescheduleAppointment(appointmentId) {
  console.log(`Rescheduling appointment: ${appointmentId}`);
  // In a real app, this would open a rescheduling flow
  alert(`You are rescheduling appointment #${appointmentId}`);
}

// Function to handle cancelling an appointment
function cancelAppointment(appointmentId) {
  console.log(`Cancelling appointment: ${appointmentId}`);
  // In a real app, this would show a confirmation dialog and make an API call
  if (confirm(`Are you sure you want to cancel appointment #${appointmentId}?`)) {
    alert(`Appointment #${appointmentId} has been cancelled.`);
    // In a real app, you would refresh the data or update the UI accordingly
    // For this demo, we'll just reload the page
    window.location.reload();
  }
}

// Function to handle searching appointments
function searchAppointments(query) {
  // In a real app, this would filter appointments based on the query
  console.log(`Searching for: ${query}`);
}