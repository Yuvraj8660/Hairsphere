
// Global variables
let map;
let userLocation;
let markers = [];
let salons = [];

// Initialize the map when the page loads
function initMap() {
  // Default location 
  const defaultLocation = { lat:22.7552  , lng:75.8968 };
  
  // Create map with default location
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 14,
    styles: [
      {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
      }
    ]
  });
  
  // Try to get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        userLocation = { 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        };
        
        // Center map on user's location
        map.setCenter(userLocation);
        
        // Add marker for user's location
        const userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "Your Location",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#9c27b0",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "white"
          }
        });
        
        // Fetch nearby salons based on user location
        fetchNearbySalons(userLocation);
      },
      error => {
        console.error("Error getting user location:", error);
        // Use default location if geolocation fails
        fetchNearbySalons(userLocation || defaultLocation);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    // Use default location if geolocation not supported
    fetchNearbySalons(userLocation || defaultLocation);
  }
  
  // Add search functionality to the map
  setupMapSearch();
}

// Setup search box on the map
function setupMapSearch() {
  const input = document.getElementById('searchBar');
  const searchBox = new google.maps.places.SearchBox(input);
  
  // Bias the search box results towards current map's viewport
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });
  
  // Listen for the event fired when the user selects a prediction and retrieve more details
  searchBox.addListener('places_changed', function() {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    // For each place, get the icon, name and location
    const bounds = new google.maps.LatLngBounds();
    
    places.forEach(function(place) {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      // Create a marker for each place
      const marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
      });
      
      if (place.geometry.viewport) {
        // Only geocodes have viewport
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    
    map.fitBounds(bounds);
  });
}

// Fetch nearby salons data from the API
function fetchNearbySalons(location) {
  fetch('http://localhost:8000/api/salons')
    .then(response => response.json())
    .then(data => {
      salons = data; // Store fetched salons in the global variable
      addSalonMarkers(salons); // Add markers to the map
      displaySalonCards(salons); // Display salon cards in the UI
    })
    .catch(error => {
      console.error('Error fetching salons:', error);
    });
}

// Add salon markers to the map
function addSalonMarkers(salons) {
  // Clear existing markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];
  
  // Add new markers
  salons.forEach(salon => {
    const position = { lat: salon.lat, lng: salon.lng };
    
    // Create info window content
    const contentString = `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin-top: 0; color: #9c27b0;">${salon.name}</h3>
        <p>${salon.address}</p>
        <div style="color: #ff6f00;">
          ${getRatingStars(salon.rating)}
          <span>${salon.rating} (${salon.reviewCount})</span>
        </div>
        <button style="background-color: #9c27b0; color: white; border: none; padding: 8px 16px; margin-top: 10px; border-radius: 4px; cursor: pointer;" onclick="bookAppointment(${salon.id})">Book Appointment</button>
      </div>
    `;
    
    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    
    // Create marker
    const marker = new google.maps.Marker({
      position: position,
      map: map,
      title: salon.name,
      animation: google.maps.Animation.DROP
    });
    
    // Add click listener to marker
    marker.addListener('click', () => {
      // Close all other info windows
      markers.forEach(m => m.infoWindow && m.infoWindow.close());
      
      infowindow.open(map, marker);
      
      // Store reference to open info window
      marker.infoWindow = infowindow;
    });
    
    // Store reference to info window
    marker.infoWindow = null;
    
    // Add marker to array
    markers.push(marker);
  });
}

// Display salon cards in the UI
function displaySalonCards(salons) {
  const salonContainer = document.getElementById('salon-cards');
  
  // Clear previous cards if container exists
  if (salonContainer) {
    salonContainer.innerHTML = '';
    
    // Create cards for each salon
    salons.forEach(salon => {
      const card = document.createElement('div');
      card.classList.add('salon-card');
      card.innerHTML = `
        <img src="${salon.image}" alt="${salon.name}" class="salon-img">
        <div class="salon-info">
          <h3>${salon.name}</h3>
          <p><i class="fas fa-map-marker-alt"></i> ${salon.address}</p>
          <div class="rating">
            ${getRatingStars(salon.rating)}
            <span>${salon.rating} (${salon.reviewCount})</span>
          </div>
          <button class="btn" onclick="bookAppointment(${salon.id})">Book Appointment</button>
        </div>
      `;
      salonContainer.appendChild(card);
    });
  }
}

// Generate star rating HTML
function getRatingStars(rating) {
  let starsHtml = '';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }
  
  return starsHtml;
}

// Handle booking appointment
function bookAppointment(salonId) {
  // Find the salon by ID
  const salon = salons.find(s => s.id === salonId);
  
  if (salon) {
    console.log(`Booking appointment at ${salon.name}`);
    // In a real app, this would redirect to a booking page or show a modal
    // For demo purposes, we'll alert the user
    alert(`You're about to book an appointment at ${salon.name}. In a production app, this would open a booking form.`);
    // window.location.href = `booking.html?salonId=${salonId}`;
  }
}

// Filter salons by search query
function filterSalons() {
  const query = document.getElementById('searchBar').value.toLowerCase();
  
  if (query.trim() === '') {
    // If search is empty, show all salons
    displaySalonCards(salons);
    return;
  }
  
  // Filter salons by name or address
  const filteredSalons = salons.filter(salon => 
    salon.name.toLowerCase().includes(query) || 
    salon.address.toLowerCase().includes(query)
  );
  
  // Update UI with filtered results
  displaySalonCards(filteredSalons);
  
  // Update map markers
  addSalonMarkers(filteredSalons);
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add search functionality
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', filterSalons);
  }
  
  // Add search button click event
  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', filterSalons);
  }
  
  // Add animation to elements when they come into view
  const observerOptions = {
    threshold: 0.25
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all elements with animate class
  const animatedElements = document.querySelectorAll('.animate');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Initialize animations for the hero section
  setTimeout(() => {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.opacity = 1;
      hero.style.transform = 'translateY(0)';
    }
  }, 100);
});

// Initialize the map when the Google Maps API is loaded
window.initMap = initMap;