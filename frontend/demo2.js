// DOM elements
const requestsList = document.getElementById('requests-list');
const requestModal = document.getElementById('request-modal');
const closeModal = document.querySelector('.close-modal');
const requestDetailsContainer = document.querySelector('.request-details');
const acceptRequestBtn = document.getElementById('accept-request');
const rejectRequestBtn = document.getElementById('reject-request');
const requestFilter = document.getElementById('request-filter');
const noRequestsEl = document.getElementById('no-requests');
const pendingCountEl = document.getElementById('pending-count');
const todayCountEl = document.getElementById('today-count');
const weekCountEl = document.getElementById('week-count');

// Current data
let currentRequests = [];
let currentRequestId = null;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Fetch appointments from the database
    fetchAppointments();
    
    // Event listeners
    requestFilter.addEventListener('change', handleFilterChange);
    closeModal.addEventListener('click', closeRequestModal);
    acceptRequestBtn.addEventListener('click', () => handleStatusChange('Confirmed'));
    rejectRequestBtn.addEventListener('click', () => handleStatusChange('Cancelled'));
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === requestModal) {
            closeRequestModal();
        }
    });
});

// Fetch appointments from the database
async function fetchAppointments(status = 'all') {
    try {
        // Replace with your actual API endpoint
        // Add owner ID as a parameter (you'll need to get this from localStorage or session)
        const ownerId = "your-owner-id"; // Replace with actual owner ID retrieval
        
        let url = `/api/appointments`;
        if (status !== 'all') {
            url += `?status=${status}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }
        
        const data = await response.json();
        
        if (data.success) {
            currentRequests = data.appointments;
            loadAppointmentRequests(status);
            updateStatCounts();
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        showToast('Failed to load appointments: ' + error.message);
        noRequestsEl.classList.remove('hidden');
        requestsList.classList.add('hidden');
    }
}

// Load appointment requests based on filter
function loadAppointmentRequests(filter = 'all') {
    requestsList.innerHTML = '';
    
    let filteredRequests = currentRequests;
    if (filter !== 'all') {
        filteredRequests = currentRequests.filter(req => req.status === filter);
    }
    
    if (filteredRequests.length === 0) {
        noRequestsEl.classList.remove('hidden');
        requestsList.classList.add('hidden');
    } else {
        noRequestsEl.classList.add('hidden');
        requestsList.classList.remove('hidden');
        
        filteredRequests.forEach(request => {
            const requestCard = createRequestCard(request);
            requestsList.appendChild(requestCard);
        });
    }
}

// Create a request card element
function createRequestCard(request) {
    const requestCard = document.createElement('div');
    requestCard.className = 'request-card';
    requestCard.dataset.id = request._id; // MongoDB uses _id
    
    // Get initials for avatar
    const initials = request.customerInfo.name.split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase();
    
    // Format date for display
    const dateObj = new Date(request.appointment.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
    });
    
    // Check if the appointment is for today
    const today = new Date();
    const isToday = dateObj.toDateString() === today.toDateString();
    const dateDisplay = isToday ? 'Today' : formattedDate;
    
    // Calculate duration based on services (if available)
    // This is an estimation since we don't have actual duration in the schema
    const estimatedDuration = request.services.length * 30 + " min";
    
    // Get the first service name or multiple if needed
    const serviceName = request.services.length > 0 
        ? request.services[0].name + (request.services.length > 1 ? ' + more' : '')
        : 'Service unavailable';
    
    requestCard.innerHTML = `
        <div class="request-info">
            <div class="client-avatar">${initials}</div>
            <div class="request-details-preview">
                <h4>${request.customerInfo.name}</h4>
                <div class="service-info">${serviceName} • ${estimatedDuration}</div>
            </div>
        </div>
        <div class="request-time-info">
            <div class="request-time">${request.appointment.time}</div>
            <div class="request-date">${dateDisplay}</div>
        </div>
        <div class="request-status-container">
            <span class="request-status status-${request.status.toLowerCase()}">${request.status}</span>
        </div>
    `;
    
    // Add click event to open modal
    requestCard.addEventListener('click', () => openRequestModal(request._id));
    
    return requestCard;
}

// Open request modal with details
function openRequestModal(requestId) {
    const request = currentRequests.find(req => req._id === requestId);
    if (!request) return;
    
    currentRequestId = requestId;
    
    // Format date for display
    const dateObj = new Date(request.appointment.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    });
    
    // Format services for display
    const servicesHtml = request.services.map(service => 
        `<div>${service.name}: $${service.price}</div>`
    ).join('');
    
    // Generate modal content
    requestDetailsContainer.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">Client:</div>
            <div class="detail-value">${request.customerInfo.name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Contact:</div>
            <div class="detail-value">
                <div>${request.customerInfo.phone}</div>
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Gender:</div>
            <div class="detail-value">${request.customerInfo.gender}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Services:</div>
            <div class="detail-value">
                ${servicesHtml}
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Date:</div>
            <div class="detail-value">${formattedDate}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Time:</div>
            <div class="detail-value">${request.appointment.time}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Total:</div>
            <div class="detail-value">$${request.total}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Status:</div>
            <div class="detail-value">
                <span class="request-status status-${request.status.toLowerCase()}">${request.status}</span>
            </div>
        </div>
    `;
    
    // Show/hide action buttons based on status
    if (request.status === 'Pending') {
        acceptRequestBtn.style.display = 'block';
        rejectRequestBtn.style.display = 'block';
    } else {
        acceptRequestBtn.style.display = 'none';
        rejectRequestBtn.style.display = 'none';
    }
    
    requestModal.style.display = 'block';
}

// Close request modal
function closeRequestModal() {
    requestModal.style.display = 'none';
    currentRequestId = null;
}

// Handle appointment status change (accept/reject)
async function handleStatusChange(newStatus) {
    if (!currentRequestId) return;
    
    try {
        // Update status in the database via API
        const response = await fetch(`/api/appointments/${currentRequestId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update appointment status');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Find and update the request status locally
            const requestIndex = currentRequests.findIndex(req => req._id === currentRequestId);
            if (requestIndex !== -1) {
                currentRequests[requestIndex].status = newStatus;
                
                // Update UI
                updateStatCounts();
                loadAppointmentRequests(requestFilter.value);
                closeRequestModal();
                
                // Show confirmation toast
                showToast(`Appointment ${newStatus === 'Confirmed' ? 'accepted' : 'rejected'} successfully!`);
            }
        } else {
            throw new Error(data.message || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error updating appointment status:', error);
        showToast('Failed to update status: ' + error.message);
    }
}

// Handle filter change
function handleFilterChange() {
    const filterValue = requestFilter.value;
    fetchAppointments(filterValue);
}

// Update stat counts
function updateStatCounts() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);
    
    const pendingCount = currentRequests.filter(req => req.status === 'Pending').length;
    
    const todayCount = currentRequests.filter(req => {
        const requestDate = new Date(req.appointment.date);
        requestDate.setHours(0, 0, 0, 0);
        return requestDate.getTime() === today.getTime();
    }).length;
    
    const weekCount = currentRequests.filter(req => {
        const requestDate = new Date(req.appointment.date);
        requestDate.setHours(0, 0, 0, 0);
        return requestDate >= today && requestDate <= oneWeekLater;
    }).length;
    
    pendingCountEl.textContent = pendingCount;
    todayCountEl.textContent = todayCount;
    weekCountEl.textContent = weekCount;
}

// Show toast notification
function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add toast styles if not already in CSS
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: fadeInOut 3s forwards;
        }
        
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}