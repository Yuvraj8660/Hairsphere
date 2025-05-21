document.addEventListener('DOMContentLoaded', function() {
  // Mobile sidebar toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event) {
    if (sidebar && sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== mobileToggle) {
      sidebar.classList.remove('active');
    }
  });
  
  // Nav dropdown toggle
  const navDropdowns = document.querySelectorAll('.nav-dropdown');
  
  navDropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.nav-link');
    
    link.addEventListener('click', function(e) {
      e.preventDefault();
      dropdown.classList.toggle('active');
    });
  });
  
  // Tab navigation
  const navLinks = document.querySelectorAll('.nav-link:not(.has-dropdown)');
  const contentSections = document.querySelectorAll('.content-section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all links and content sections
      navLinks.forEach(l => l.classList.remove('active'));
      contentSections.forEach(section => section.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Show corresponding content section
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.classList.add('active');
      }
    });
  });
  
  // Appointment tabs
  const appointmentTabs = document.querySelectorAll('.appointment-tab');
  const appointmentSubsections = document.querySelectorAll('.appointment-subsection');
  
  appointmentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and subsections
      appointmentTabs.forEach(t => t.classList.remove('active'));
      appointmentSubsections.forEach(section => section.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding subsection
      const targetId = this.getAttribute('data-target');
      const targetSubsection = document.getElementById(targetId);
      
      if (targetSubsection) {
        targetSubsection.classList.add('active');
      }
    });
  });
  
  // Service tabs
  const serviceTabs = document.querySelectorAll('.service-tab');
  const serviceSubsections = document.querySelectorAll('.service-subsection');
  
  serviceTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and subsections
      serviceTabs.forEach(t => t.classList.remove('active'));
      serviceSubsections.forEach(section => section.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding subsection
      const targetId = this.getAttribute('data-target');
      const targetSubsection = document.getElementById(targetId);
      
      if (targetSubsection) {
        targetSubsection.classList.add('active');
      }
    });
  });
  
  // Insight tabs
  const insightTabs = document.querySelectorAll('.insight-tab');
  const insightContents = document.querySelectorAll('.insight-content');
  
  insightTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs and contents
      insightTabs.forEach(t => t.classList.remove('active'));
      insightContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding content
      const targetId = this.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
  
  // Profile toggle settings
  const profileToggle = document.querySelector('.profile-dropdown');
  const settingsMenu = document.querySelector('.settings-menu');
  
  if (profileToggle && settingsMenu) {
    profileToggle.addEventListener('click', function() {
      settingsMenu.classList.toggle('active');
    });
    
    // Close settings when clicking outside
    document.addEventListener('click', function(event) {
      if (settingsMenu.classList.contains('active') && !settingsMenu.contains(event.target) && event.target !== profileToggle) {
        settingsMenu.classList.remove('active');
      }
    });
  }
  
  // Form submissions with validation
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Simulate form submission
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Processing...';
          submitBtn.disabled = true;
          
          // Simulate API call
          setTimeout(() => {
            submitBtn.textContent = 'Success!';
            
            // Reset form
            setTimeout(() => {
              form.reset();
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
              
              // If there's a modal, close it
              const modal = form.closest('.modal');
              if (modal) {
                modal.classList.remove('active');
              }
            }, 1000);
          }, 1500);
        }
      }
    });
  });
  
  // Modal handling
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal');
  const modalCloses = document.querySelectorAll('.modal-close');
  
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        modal.classList.add('active');
      }
    });
  });
  
  modalCloses.forEach(close => {
    close.addEventListener('click', function() {
      const modal = this.closest('.modal');
      
      if (modal) {
        modal.classList.remove('active');
      }
    });
  });
  
  // Close modal when clicking outside
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
      }
    });
  });
  
  // Service actions (edit/delete)
  const editButtons = document.querySelectorAll('.service-edit');
  const deleteButtons = document.querySelectorAll('.service-delete');
  
  editButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const serviceId = this.getAttribute('data-id');
      // Logic to handle editing the service
      console.log('Edit service with ID:', serviceId);
    });
  });
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const serviceId = this.getAttribute('data-id');
      
      if (confirm('Are you sure you want to delete this service?')) {
        // Logic to handle deleting the service
        console.log('Delete service with ID:', serviceId);
        
        // Remove the service card
        const serviceCard = this.closest('.service-card');
        if (serviceCard) {
          serviceCard.remove();
        }
      }
    });
  });
  
  // Appointment actions (confirm/reject)
  const confirmButtons = document.querySelectorAll('.appointment-confirm');
  const rejectButtons = document.querySelectorAll('.appointment-reject');
  
  confirmButtons.forEach(button => {
    button.addEventListener('click', function() {
      const appointmentId = this.getAttribute('data-id');
      
      // Logic to handle confirming the appointment
      console.log('Confirm appointment with ID:', appointmentId);
      
      // Update the status badge
      const statusBadge = this.closest('tr').querySelector('.status-badge');
      if (statusBadge) {
        statusBadge.textContent = 'Confirmed';
        statusBadge.classList.remove('pending');
        statusBadge.classList.add('confirmed');
      }
      
      // Remove action buttons
      this.closest('td').innerHTML = '<span class="text-success">Confirmed</span>';
    });
  });
  
  rejectButtons.forEach(button => {
    button.addEventListener('click', function() {
      const appointmentId = this.getAttribute('data-id');
      
      if (confirm('Are you sure you want to reject this appointment?')) {
        // Logic to handle rejecting the appointment
        console.log('Reject appointment with ID:', appointmentId);
        
        // Update the status badge
        const statusBadge = this.closest('tr').querySelector('.status-badge');
        if (statusBadge) {
          statusBadge.textContent = 'Rejected';
          statusBadge.classList.remove('pending');
          statusBadge.classList.add('rejected');
        }
        
        // Remove action buttons
        this.closest('td').innerHTML = '<span class="text-danger">Rejected</span>';
      }
    });
  });
  
  // Initialize charts (placeholder for real chart implementation)
  function initializeCharts() {
    console.log('Charts initialized');
    // This would be replaced with actual chart initialization code
    // For example: Chart.js, ApexCharts, or other charting libraries
  }
  
  // Load Chart.js library dynamically
  function loadChartJs(callback) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
  
  // Generate dummy data for revenue trend
  function generateRevenueData(days) {
    const labels = [];
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
      data.push(Math.floor(Math.random() * 500) + 100); // Random revenue between 100 and 600
    }
    return { labels, data };
  }
  
  // Generate dummy data for popular services images
  function generatePopularServices() {
    return [
      { id: 1, name: "Women's Haircut & Style", img: '/api/placeholder/150/100?text=Haircut' },
      { id: 2, name: "Full Hair Coloring", img: '/api/placeholder/150/100?text=Coloring' },
      { id: 3, name: "Men's Haircut", img: '/api/placeholder/150/100?text=Men\'s+Cut' },
      { id: 4, name: "Manicure & Pedicure", img: '/api/placeholder/150/100?text=Manicure' },
      { id: 5, name: "Beard Trim", img: '/api/placeholder/150/100?text=Beard+Trim' }
    ];
  }
  
  // Render revenue trend chart
  function renderRevenueTrendChart(ctx, days) {
    const revenueData = generateRevenueData(days);
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: revenueData.labels,
        datasets: [{
          label: 'Revenue',
          data: revenueData.data,
          fill: false,
          borderColor: 'rgba(156, 39, 176, 1)',
          backgroundColor: 'rgba(156, 39, 176, 0.2)',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { display: true, title: { display: true, text: 'Date' } },
          y: { display: true, title: { display: true, text: 'Revenue ($)' }, beginAtZero: true }
        }
      }
    });
  }
  
  // Render pie chart for revenue distribution (dummy)
  function renderRevenuePieChart(ctx) {
    const data = {
      labels: ['Haircut', 'Coloring', 'Manicure', 'Beard Trim', 'Others'],
      datasets: [{
        data: [300, 150, 100, 80, 50],
        backgroundColor: [
          'rgba(156, 39, 176, 0.7)',
          'rgba(255, 111, 0, 0.7)',
          'rgba(33, 150, 243, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(244, 67, 54, 0.7)'
        ],
        hoverOffset: 30
      }]
    };
    return new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }
  
  // Render popular services images with add/remove functionality
  function renderPopularServices(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
  
    const services = generatePopularServices();
  
    container.innerHTML = ''; // Clear existing content
  
    services.forEach(service => {
      const serviceDiv = document.createElement('div');
      serviceDiv.className = 'popular-service-card';
      serviceDiv.style.position = 'relative';
      serviceDiv.style.display = 'inline-block';
      serviceDiv.style.margin = '10px';
      serviceDiv.style.border = '1px solid #ddd';
      serviceDiv.style.borderRadius = '8px';
      serviceDiv.style.overflow = 'hidden';
      serviceDiv.style.width = '150px';
      serviceDiv.style.cursor = 'pointer';
  
      const img = document.createElement('img');
      img.src = "https://content.jdmagicbox.com/v2/comp/indore/a3/0731px731.x731.190402175240.i7a3/catalogue/barber-s-unisex-salon-indore-1e5eeqkari.jpg";
      img.alt = service.name;
      img.style.width = '100%';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      serviceDiv.appendChild(img);
  
      const nameDiv = document.createElement('div');
      nameDiv.textContent = service.name;
      nameDiv.style.textAlign = 'center';
      nameDiv.style.padding = '5px 0';
      nameDiv.style.fontSize = '14px';
      nameDiv.style.fontWeight = '600';
      serviceDiv.appendChild(nameDiv);
  
      // Add remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.title = 'Remove Service';
      removeBtn.style.position = 'absolute';
      removeBtn.style.top = '5px';
      removeBtn.style.right = '5px';
      removeBtn.style.background = 'rgba(244, 67, 54, 0.8)';
      removeBtn.style.color = 'white';
      removeBtn.style.border = 'none';
      removeBtn.style.borderRadius = '50%';
      removeBtn.style.width = '24px';
      removeBtn.style.height = '24px';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.fontSize = '18px';
      removeBtn.style.lineHeight = '20px';
      removeBtn.style.padding = '0';
  
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to remove "${service.name}"?`)) {
          serviceDiv.remove();
        }
      });
  
      serviceDiv.appendChild(removeBtn);
  
      container.appendChild(serviceDiv);
    });
  
    // Add button to add new service
    const addBtn = document.createElement('button');
    addBtn.textContent = '+ Add Service';
    addBtn.style.display = 'inline-block';
    addBtn.style.margin = '10px';
    addBtn.style.padding = '10px 20px';
    addBtn.style.fontSize = '14px';
    addBtn.style.fontWeight = '600';
    addBtn.style.color = 'white';
    addBtn.style.backgroundColor = 'var(--primary)';
    addBtn.style.border = 'none';
    addBtn.style.borderRadius = '8px';
    addBtn.style.cursor = 'pointer';
  
    addBtn.addEventListener('click', () => {
      const serviceName = prompt('Enter the name of the new service:');
      if (serviceName && serviceName.trim() !== '') {
        const newServiceDiv = document.createElement('div');
        newServiceDiv.className = 'popular-service-card';
        newServiceDiv.style.position = 'relative';
        newServiceDiv.style.display = 'inline-block';
        newServiceDiv.style.margin = '10px';
        newServiceDiv.style.border = '1px solid #ddd';
        newServiceDiv.style.borderRadius = '8px';
        newServiceDiv.style.overflow = 'hidden';
        newServiceDiv.style.width = '150px';
        newServiceDiv.style.cursor = 'pointer';
  
        const img = document.createElement('img');
        img.src = '/api/placeholder/150/100?text=New+Service';
        img.alt = serviceName;
        img.style.width = '100%';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        newServiceDiv.appendChild(img);
  
        const nameDiv = document.createElement('div');
        nameDiv.textContent = serviceName;
        nameDiv.style.textAlign = 'center';
        nameDiv.style.padding = '5px 0';
        nameDiv.style.fontSize = '14px';
        nameDiv.style.fontWeight = '600';
        newServiceDiv.appendChild(nameDiv);
  
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.title = 'Remove Service';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '5px';
        removeBtn.style.right = '5px';
        removeBtn.style.background = 'rgba(244, 67, 54, 0.8)';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '24px';
        removeBtn.style.height = '24px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '18px';
        removeBtn.style.lineHeight = '20px';
        removeBtn.style.padding = '0';
  
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Are you sure you want to remove "${serviceName}"?`)) {
            newServiceDiv.remove();
          }
        });
  
        newServiceDiv.appendChild(removeBtn);
  
        container.insertBefore(newServiceDiv, addBtn);
      }
    });
  
    container.appendChild(addBtn);
  }
  
  // Initialize charts and popular services after Chart.js is loaded
  loadChartJs(() => {
    const ctxLine = document.getElementById('revenueTrendCanvas').getContext('2d');
    const ctxPie = document.getElementById('revenuePieChartCanvas').getContext('2d');
    const revenueChart = renderRevenueTrendChart(ctxLine, 7);
    const pieChart = renderRevenuePieChart(ctxPie);
  
    renderPopularServices('popularServicesContainer');
  });
  
  // Call chart initialization
  initializeCharts();
  
  // Set home as active by default
  const defaultTab = document.querySelector('.nav-link[href="#dashboard"]');
  if (defaultTab) {
    defaultTab.click();
  }

  // Add popup and remove appointment item on accept or cancel in Upcoming Appointments section
  const upcomingSection = document.querySelector('.upcoming-appointments');
  if (upcomingSection) {
    const acceptButtons = upcomingSection.querySelectorAll('.btn-primary');
    const cancelButtons = upcomingSection.querySelectorAll('.btn-danger');

    acceptButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (confirm('Do you want to accept this appointment?')) {
          alert('Appointment accepted');
          const appointmentItem = this.closest('.appointment-item');
          if (appointmentItem) {
            appointmentItem.remove();
          }
        }
      });
    });

    cancelButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (confirm('Do you want to cancel this appointment?')) {
          alert('Appointment canceled');
          const appointmentItem = this.closest('.appointment-item');
          if (appointmentItem) {
            appointmentItem.remove();
          }
        }
      });
    });
  }
});

// Function to toggle status of salon (online/offline)
function toggleSalonStatus() {
  const statusElement = document.querySelector('.salon-status');
  
  if (statusElement.classList.contains('online')) {
    statusElement.classList.remove('online');
    statusElement.classList.add('offline');
    statusElement.innerHTML = '<i class="fas fa-circle"></i> Offline';
  } else {
    statusElement.classList.remove('offline');
    statusElement.classList.add('online');
    statusElement.innerHTML = '<i class="fas fa-circle"></i> Online';
  }
}

// Function to handle reply to reviews
function replyToReview(reviewId) {
  const replyForm = document.querySelector(`#reply-form-${reviewId}`);
  
  if (replyForm) {
    replyForm.classList.toggle('active');
  }
}

// Function to handle adding a new service
function addNewService(type) {
  // Here you would normally submit a form or make an API call
  console.log(`Adding new ${type}`);
  
  // For demo purposes, we'll just add a placeholder
  const container = document.querySelector(`.${type}-cards`);
  
  if (container) {
    const newCard = document.createElement('div');
    newCard.className = 'service-card';
    newCard.innerHTML = `
      <div class="service-img-container">
        <img src="/api/placeholder/300/200" alt="New Service" class="service-img">
        <div class="service-actions">
          <button class="btn-icon edit service-edit" data-id="new">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon delete service-delete" data-id="new">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="service-info">
        <h3>New Service</h3>
        <p>Description of the new service added.</p>
        <div class="service-price">$50</div>
        <div class="service-duration">
          <i class="fas fa-clock"></i> 45 mins
        </div>
      </div>
    `;
    
    container.prepend(newCard);
    
    // Add event listeners to the new buttons
    const editBtn = newCard.querySelector('.service-edit');
    const deleteBtn = newCard.querySelector('.service-delete');
    
    editBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Edit new service');
    });
    
    deleteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to delete this service?')) {
        newCard.remove();
      }
    });
  }
}