document.addEventListener('DOMContentLoaded', function() {
    // Sample salon data - In a real app, this would come from an API
    const salonData = {
      id: "salon123",
      name: "Glamour Hair & Beauty",
      address: "123 Fashion Avenue, Beauty District, New York",
      rating: 4.8,
      price: "$$$",
      images: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035",
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df",
        "https://images.unsplash.com/photo-1470259078422-826894b933aa",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
      ],
      badges: [
        { icon: "fa-certificate", text: "Premium Salon" },
        { icon: "fa-check-circle", text: "Verified" },
        { icon: "fa-percent", text: "10% Off First Visit" },
        { icon: "fa-map-marker-alt", text: "2.3 km away" }
      ],
      services: [
        { name: "Men's Haircut", duration: "30 min", price: 35 },
        { name: "Women's Haircut", duration: "45 min", price: 55 },
        { name: "Beard Trim", duration: "15 min", price: 15 },
        { name: "Hair Coloring", duration: "90 min", price: 90 },
        { name: "Hair Wash & Styling", duration: "30 min", price: 40 },
        { name: "Full Facial", duration: "60 min", price: 75 },
        { name: "Manicure", duration: "45 min", price: 35 }
      ],
      hours: [
        { day: "Mon", open: "9:00", close: "18:00", isClosed: false },
        { day: "Tue", open: "9:00", close: "18:00", isClosed: false },
        { day: "Wed", open: "9:00", close: "20:00", isClosed: false },
        { day: "Thu", open: "9:00", close: "20:00", isClosed: false },
        { day: "Fri", open: "9:00", close: "20:00", isClosed: false },
        { day: "Sat", open: "10:00", close: "16:00", isClosed: false },
        { day: "Sun", open: "", close: "", isClosed: true }
      ],
      reviews: [
        {
          id: "review1",
          user: { name: "Michael Johnson", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
          rating: 5,
          date: "April 2, 2025",
          content: "Excellent service! The stylist was very professional and understood exactly what I wanted. Will definitely come back.",
          photos: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1"]
        },
        {
          id: "review2",
          user: { name: "Sarah Williams", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
          rating: 4,
          date: "March 28, 2025",
          content: "Great experience overall. The haircut was nice but took longer than expected. The ambiance is very relaxing though.",
          photos: []
        }
      ],
      similarSalons: [
        { id: "salon234", name: "Classy Cuts", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70", rating: 4.6, price: "$$" },
        { id: "salon345", name: "Hair Haven", image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250", rating: 4.3, price: "$" },
        { id: "salon456", name: "The Barber Shop", image: "https://www.playsalon.in/wp-content/uploads/2019/09/6-Essential-Mens-Hair-Care-Tips-Play-Salon.jpg", rating: 4.9, price: "$$$" }
      ]
    };
  
    // Load salon data into the UI
    loadSalonData(salonData);
    initializeImageSlider(salonData.images);
    setupTimeSlots();
    setupServiceSelection(salonData.services);
    updateTotalPrice();
  
    // Set up event listeners
    document.getElementById('appointmentDate').addEventListener('change', setupTimeSlots);
    document.getElementById('bookNowBtn').addEventListener('click', handleBooking);
  });
  
  function loadSalonData(salon) {
    // Update salon header information
    document.getElementById('salonName').textContent = salon.name;
    document.getElementById('salonAddress').querySelector('span').textContent = salon.address;
    document.getElementById('salonRating').querySelector('span').textContent = salon.rating;
    document.getElementById('salonPrice').textContent = salon.price;
  
    // Update badges
    const badgesContainer = document.getElementById('salonBadges');
    salon.badges.forEach(badge => {
      const badgeEl = document.createElement('div');
      badgeEl.className = 'salon-badge';
      badgeEl.innerHTML = `<i class="fas ${badge.icon}"></i> ${badge.text}`;
      badgesContainer.appendChild(badgeEl);
    });
  
    // Update services
    const servicesContainer = document.getElementById('servicesContainer');
    salon.services.forEach(service => {
      const serviceEl = document.createElement('div');
      serviceEl.className = 'service-card';
      serviceEl.innerHTML = `
        <div class="service-info">
          <div class="service-name">${service.name}</div>
          <div class="service-duration">${service.duration}</div>
        </div>
        <div class="service-price">$${service.price}</div>
      `;
      servicesContainer.appendChild(serviceEl);
    });
  
    // Update working hours
    const hoursContainer = document.getElementById('hoursContainer');
    const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Convert JS day (0-6) to our day index (0-6 starting from Monday)
    const todayIndex = dayMap[today];
    
    salon.hours.forEach((hour, index) => {
      const dayEl = document.createElement('div');
      dayEl.className = `day-card ${index === todayIndex ? 'today' : ''} ${hour.isClosed ? 'closed' : ''}`;
      dayEl.innerHTML = `
        <div class="day-name">${hour.day}</div>
        <div class="day-hours">${hour.isClosed ? 'Closed' : `${hour.open} - ${hour.close}`}</div>
      `;
      hoursContainer.appendChild(dayEl);
    });
  
    // Update reviews
    const reviewsContainer = document.getElementById('reviewsContainer');
    salon.reviews.forEach(review => {
      const reviewEl = document.createElement('div');
      reviewEl.className = 'review-card';
      
      let photosHtml = '';
      if (review.photos.length > 0) {
        photosHtml = '<div class="review-photos">';
        review.photos.forEach(photo => {
          photosHtml += `<div class="review-photo"><img src="${photo}" alt="Review photo"></div>`;
        });
        photosHtml += '</div>';
      }
      
      const starsHtml = getStarsHtml(review.rating);
      
      reviewEl.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">
              <img src="${review.user.avatar}" alt="${review.user.name}">
            </div>
            <div>
              <div class="reviewer-name">${review.user.name}</div>
              <div class="review-date">${review.date}</div>
            </div>
          </div>
          <div class="review-rating">${starsHtml}</div>
        </div>
        <div class="review-content">
          <p>${review.content}</p>
          ${photosHtml}
        </div>
      `;
      reviewsContainer.appendChild(reviewEl);
    });
  
    // Update similar salons
    const similarSalonsContainer = document.getElementById('similarSalons');
    salon.similarSalons.forEach(similarSalon => {
      const salonEl = document.createElement('div');
      salonEl.className = 'similar-salon-card';
      salonEl.setAttribute('data-salon-id', similarSalon.id);
      salonEl.innerHTML = `
        <div class="similar-salon-image">
          <img src="${similarSalon.image}" alt="${similarSalon.name}">
        </div>
        <div class="similar-salon-info">
          <div class="similar-salon-name">${similarSalon.name}</div>
          <div class="similar-salon-meta">
            <div class="similar-salon-rating"><i class="fas fa-star"></i> ${similarSalon.rating}</div>
            <div class="similar-salon-price">${similarSalon.price}</div>
          </div>
        </div>
      `;
      salonEl.addEventListener('click', () => {
        // In a real app, this would navigate to the selected salon's detail page
        alert(`Navigating to ${similarSalon.name} details...`);
      });
      similarSalonsContainer.appendChild(salonEl);
    });
  
    // Set default date for appointment to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('appointmentDate').valueAsDate = tomorrow;
  }
  
  function initializeImageSlider(images) {
    const sliderWrapper = document.getElementById('sliderWrapper');
    const sliderPagination = document.getElementById('sliderPagination');
    let currentSlide = 0;
    
    // Create slides
    images.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = 'slider-slide';
      slide.innerHTML = `<img src="${image}" class="slider-image" alt="Salon image ${index + 1}">`;
      sliderWrapper.appendChild(slide);
      
      const dot = document.createElement('div');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(index));
      sliderPagination.appendChild(dot);
    });
    
    // Initialize slider width
    sliderWrapper.style.width = `${images.length * 100}%`;
    
    function goToSlide(index) {
      currentSlide = index;
      sliderWrapper.style.transform = `translateX(-${(100 / images.length) * currentSlide}%)`;
      
      // Update active dot
      document.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
    
    // Set up navigation buttons
    document.getElementById('prevSlide').addEventListener('click', () => {
      currentSlide = (currentSlide > 0) ? currentSlide - 1 : images.length - 1;
      goToSlide(currentSlide);
    });
    
    document.getElementById('nextSlide').addEventListener('click', () => {
      currentSlide = (currentSlide < images.length - 1) ? currentSlide + 1 : 0;
      goToSlide(currentSlide);
    });
    
    // Set up auto-sliding (optional)
    let slideInterval = setInterval(() => {
      currentSlide = (currentSlide < images.length - 1) ? currentSlide + 1 : 0;
      goToSlide(currentSlide);
    }, 5000);
    
    // Pause auto-sliding when user interacts with the slider
    document.querySelector('.slider-container').addEventListener('mouseenter', () => {
      clearInterval(slideInterval);
    });
    
    document.querySelector('.slider-container').addEventListener('mouseleave', () => {
      slideInterval = setInterval(() => {
        currentSlide = (currentSlide < images.length - 1) ? currentSlide + 1 : 0;
        goToSlide(currentSlide);
      }, 5000);
    });
  }
  
  function setupTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';
    
    // Generate time slots from 9 AM to 8 PM with 30-minute intervals
    const startHour = 9;
    const endHour = 20;
    const interval = 30; // in minutes
    
    // Get selected date
    const selectedDate = new Date(document.getElementById('appointmentDate').value);
    const today = new Date();
    const isSameDay = selectedDate.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        // Skip past time slots if the selected date is today
        if (isSameDay && (hour < currentHour || (hour === currentHour && minute <= currentMinute))) {
          continue;
        }
        
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        
        const timeSlot = document.createElement('div');
        
        // Randomly mark some slots as booked (for demo purposes)
        const isBooked = Math.random() < 0.3;
        
        timeSlot.className = `time-slot ${isBooked ? 'booked' : ''}`;
        timeSlot.setAttribute('data-time', timeStr);
        timeSlot.textContent = displayTime;
        
        if (!isBooked) {
          timeSlot.addEventListener('click', function() {
            // Deselect all time slots
            document.querySelectorAll('.time-slot').forEach(slot => {
              slot.classList.remove('selected');
            });
            
            // Select this time slot
            this.classList.add('selected');
            
            // Enable the Book Now button if at least one service is selected
            updateBookNowButtonState();
          });
        }
        
        timeSlotsContainer.appendChild(timeSlot);
      }
    }
  }
  
  function setupServiceSelection(services) {
    const serviceSelectionContainer = document.getElementById('serviceSelection');
    
    services.forEach(service => {
      const serviceCheckbox = document.createElement('div');
      serviceCheckbox.className = 'service-checkbox-container';
      serviceCheckbox.innerHTML = `
        <div class="service-checkbox-info">
          <div class="service-checkbox-name">${service.name}</div>
          <div class="service-checkbox-details">
            <span class="service-checkbox-duration">${service.duration}</span>
            <span class="service-checkbox-price">$${service.price}</span>
          </div>
        </div>
        <input type="checkbox" class="service-checkbox" data-service-name="${service.name}" data-service-price="${service.price}">
      `;
      
      serviceCheckbox.addEventListener('click', function(e) {
        if (e.target.type !== 'checkbox') {
          const checkbox = this.querySelector('input[type="checkbox"]');
          checkbox.checked = !checkbox.checked;
          this.classList.toggle('selected', checkbox.checked);
          updateTotalPrice();
          updateBookNowButtonState();
        }
      });
      
      serviceCheckbox.querySelector('input[type="checkbox"]').addEventListener('change', function() {
        serviceCheckbox.classList.toggle('selected', this.checked);
        updateTotalPrice();
        updateBookNowButtonState();
      });
      
      serviceSelectionContainer.appendChild(serviceCheckbox);
    });
  }
  
  function updateTotalPrice() {
    const selectedServices = document.querySelectorAll('.service-checkbox:checked');
    let total = 0;
    
    selectedServices.forEach(service => {
      total += parseFloat(service.getAttribute('data-service-price'));
    });
    
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
  }
  
  function updateBookNowButtonState() {
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    const selectedServices = document.querySelectorAll('.service-checkbox:checked');
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    
    const bookNowBtn = document.getElementById('bookNowBtn');
    
    // Enable the button if at least one service is selected, a time slot is selected, and customer info is provided
    bookNowBtn.disabled = !(selectedTimeSlot && selectedServices.length > 0 && customerName && customerPhone);
  }
   
  async function handleBooking() {
    const selectedServices = Array.from(document.querySelectorAll('.service-checkbox:checked')).map(checkbox => ({
      name: checkbox.getAttribute('data-service-name'),
      price: parseFloat(checkbox.getAttribute('data-service-price'))
    }));
  
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    const selectedTime = selectedTimeSlot ? selectedTimeSlot.getAttribute('data-time') : null;
  
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
  
    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
  
    const booking = {
     salonId: "salon123", // Replace with dynamic value as needed
      customerInfo: {
        name: customerName,
        phone: customerPhone,
        gender: gender
      },
      appointment: {
        date: appointmentDate,
        time: selectedTime
      },
      services: selectedServices,
      total: total
    };
  
    try {
        const res = await fetch('/api/appointments/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(booking)
        });
      
        const contentType = res.headers.get("content-type");
        
        let responseData;
        if (contentType && contentType.includes("application/json")) {
          responseData = await res.json();
        } else {
          responseData = null;
        }
      
        if (!res.ok) {
          throw new Error((responseData && responseData.message) || 'Failed to book appointment');
        }
      
        alert(`Booking confirmed!\nName: ${customerName}\nDate: ${appointmentDate}\nTime: ${selectedTime}\nTotal: $${total.toFixed(2)}`);
        console.log('Booking successful:', responseData);
      
      } catch (error) {
        console.error('Booking failed:', error);
        alert(`Error: ${error.message}`);
      }
      
  }


    
    console.log("Booking details:", booking);



    // Helper function to generate star rating HTML
  function getStarsHtml(rating) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
  }
  
  // Form input validations
  document.getElementById('customerName').addEventListener('input', updateBookNowButtonState);
  document.getElementById('customerPhone').addEventListener('input', updateBookNowButtonState);