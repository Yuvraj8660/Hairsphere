// Wait for the DOM to fully load
window.addEventListener('DOMContentLoaded', function() {
  // Prefill phone number if stored
  const storedPhone = localStorage.getItem('newOwnerPhone');
  if (storedPhone) {
    const ownerNumberInput = document.getElementById('ownerNumber');
    if (ownerNumberInput) {
      ownerNumberInput.value = storedPhone.replace('+91', '');
    }
  }

  // Button to go from owner details to salon details
  const nextToSalonBtn = document.getElementById('nextToSalon');
  if (nextToSalonBtn) {
    nextToSalonBtn.addEventListener('click', function() {
      document.getElementById('ownerDetails').style.display = 'none';
      document.getElementById('salonDetails').style.display = 'block';
    });
  }

  // Button to go from salon details to service details
  const nextToServiceBtn = document.getElementById('nextToService');
  if (nextToServiceBtn) {
    nextToServiceBtn.addEventListener('click', function() {
      document.getElementById('salonDetails').style.display = 'none';
      document.getElementById('serviceDetails').style.display = 'block';
    });
  }

  // Add service button
  const addServiceBtn = document.getElementById('addService');
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', function() {
      const servicesContainer = document.getElementById('servicesContainer');
      const newService = document.createElement('div');
      newService.classList.add('service-item');
      newService.innerHTML = `
        <label>Service Name:</label>
        <input type="text" name="serviceName" class="serviceName" required>

        <label>Price:</label>
        <input type="number" name="price" class="price" required>

        <label>Service Time:</label>
        <input type="text" name="time" class="time" required>
      `;
      servicesContainer.appendChild(newService);
    });
  }

  // Submit form
  const serviceForm = document.getElementById('serviceForm');
  if (serviceForm) {
    serviceForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      try {
        const ownerName = document.getElementById('ownerName').value.trim();
        const ownerNumber = "+91" + document.getElementById('ownerNumber').value.trim();
        const salonName = document.getElementById('salonName').value.trim();
        const address = document.getElementById('address').value.trim();
        const timing = document.getElementById('timing').value.trim();
        const workingDays = Array.from(document.querySelectorAll('input[name="workingDay"]:checked')).map(input => input.value);

        if (!ownerName || !ownerNumber || !salonName || !address || !timing || workingDays.length === 0) {
          alert('Please fill all required fields.');
          return;
        }

        // Create owner
        const ownerData = { name: ownerName, number: ownerNumber };
        const ownerResponse = await fetch('/api/owners/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ownerData),
        });
        const owner = await ownerResponse.json();

        if (!owner.success) {
          alert('Owner registration failed: ' + owner.message);
          return;
        }

        // Create salon
        const salonData = {
          salonName,
          address,
          timing,
          workingDays,
          ownerId: owner.owner._id,
        };

        const salonResponse = await fetch('/api/salons/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(salonData),
        });
        const salon = await salonResponse.json();

        if (!salon.success) {
          alert('Salon registration failed: ' + salon.message);
          return;
        }

        // Add services
        const services = Array.from(document.querySelectorAll('.service-item')).map(service => ({
          name: service.querySelector('.serviceName').value.trim(),
          price: parseFloat(service.querySelector('.price').value),
          time: service.querySelector('.time').value.trim(),
          salonId: salon.salon._id,
        }));

        for (const service of services) {
          const serviceResponse = await fetch('/api/services/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(service),
          });
          const serviceResult = await serviceResponse.json();

          if (!serviceResult.success) {
            alert('Service addition failed: ' + serviceResult.message);
            return;
          }
        }

        alert('Salon and services registered successfully!');
        localStorage.setItem('ownerId', owner.owner._id);
        window.location.href = 'main_owner.html';

      } catch (error) {
        console.error('Error during submission:', error);
        alert('Something went wrong. Please try again.');
      }
    });
  }
});
