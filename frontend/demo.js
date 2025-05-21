/*// Simulated auth: fetch phone number from login (localStorage)
document.getElementById('ownerPhone').value = localStorage.getItem('userPhone') || '';

// Working days
const workingDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const workingDaysList = document.getElementById('workingDaysList');

workingDays.forEach(day => {
  const dayBlock = document.createElement('div');
  dayBlock.classList.add('day-block');

  dayBlock.innerHTML = `
    <strong>${day}</strong>
    <div class="time-inputs">
      Open: <input type="time" name="open-${day}" />
      Close: <input type="time" name="close-${day}" />
    </div>
    Closed: <input type="checkbox" id="closed-${day}" />
    <br/>
  `;

  workingDaysList.appendChild(dayBlock);

  const checkbox = dayBlock.querySelector(`#closed-${day}`);
  const openInput = dayBlock.querySelector(`[name="open-${day}"]`);
  const closeInput = dayBlock.querySelector(`[name="close-${day}"]`);
  const timeInputsDiv = dayBlock.querySelector('.time-inputs');

  checkbox.addEventListener('change', () => {
    const isClosed = checkbox.checked;
    if (isClosed) {
      timeInputsDiv.style.pointerEvents = 'none';
      openInput.disabled = true;
      closeInput.disabled = true;
      dayBlock.classList.add('faded');
    } else {
      timeInputsDiv.style.pointerEvents = 'auto';
      openInput.disabled = false;
      closeInput.disabled = false;
      dayBlock.classList.remove('faded');
    }
  });
});

// Add service blocks
function addService() {
  const div = document.createElement('div');
  div.classList.add('service');
  div.innerHTML = `
    Name: <input type="text" class="service-name" required />
    Duration: <input type="text" class="service-duration" required />
    Price: <input type="number" class="service-price" required />
    <br/>
  `;
  document.getElementById('servicesList').appendChild(div);
}

// Submit handler
document.getElementById('salonForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const salon = {
    id: crypto.randomUUID(),
    salonName: document.getElementById('salonName').value,
    owner: {
      name: document.getElementById('ownerName').value
    },
    phone: document.getElementById('ownerPhone').value,
    address: document.getElementById('address').value,
    services: [],
    workingDays: []
  };

  document.querySelectorAll('#servicesList .service').forEach(div => {
    salon.services.push({
      name: div.querySelector('.service-name').value,
      duration: div.querySelector('.service-duration').value,
      price: parseFloat(div.querySelector('.service-price').value)
    });
  });

  workingDays.forEach(day => {
    salon.workingDays.push({
      day: day,
      open: document.querySelector(`[name="open-${day}"]`).value,
      close: document.querySelector(`[name="close-${day}"]`).value,
      isClosed: document.getElementById(`closed-${day}`).checked
    });
  });

  fetch('/api/salons/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(salon)
  })
    .then(res => res.json())
    .then(data => {
      alert('Salon added successfully!');
      console.log(data);
    })
    .catch(err => {
      console.error(err);
      alert('Error adding salon.');
    });
});
*/


document.addEventListener('DOMContentLoaded', function () {
    // Autofill owner phone from localStorage
    const phoneInput = document.getElementById('ownerPhone');
    if (phoneInput) {
      phoneInput.value = (localStorage.getItem('userPhone') || '').replace('+91', '');
    }
  
    // Handle step-by-step navigation
    const nextToSalonBtn = document.getElementById('nextToSalon');
    if (nextToSalonBtn) {
      nextToSalonBtn.addEventListener('click', () => {
        document.getElementById('ownerDetails').style.display = 'none';
        document.getElementById('salonDetails').style.display = 'block';
      });
    }
  
    const nextToServiceBtn = document.getElementById('nextToService');
    if (nextToServiceBtn) {
      nextToServiceBtn.addEventListener('click', () => {
        document.getElementById('salonDetails').style.display = 'none';
        document.getElementById('serviceDetails').style.display = 'block';
      });
    }
  
    // Working days logic
    const workingDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const workingDaysList = document.getElementById('workingDaysList');
  
    workingDays.forEach(day => {
      const dayBlock = document.createElement('div');
      dayBlock.classList.add('day-block');
  
      dayBlock.innerHTML = `
        <strong>${day}</strong>
        <div class="time-inputs">
          Open: <input type="time" name="open-${day}" />
          Close: <input type="time" name="close-${day}" />
        </div>
        Closed: <input type="checkbox" id="closed-${day}" />
        <br/>
      `;
  
      workingDaysList.appendChild(dayBlock);
  
      const checkbox = dayBlock.querySelector(`#closed-${day}`);
      const openInput = dayBlock.querySelector(`[name="open-${day}"]`);
      const closeInput = dayBlock.querySelector(`[name="close-${day}"]`);
      const timeInputsDiv = dayBlock.querySelector('.time-inputs');
  
      checkbox.addEventListener('change', () => {
        const isClosed = checkbox.checked;
        timeInputsDiv.style.pointerEvents = isClosed ? 'none' : 'auto';
        openInput.disabled = isClosed;
        closeInput.disabled = isClosed;
        dayBlock.classList.toggle('faded', isClosed);
      });
    });
  
    // Add services
    const addServiceBtn = document.getElementById('addService');
    if (addServiceBtn) {
      addServiceBtn.addEventListener('click', () => {
        const servicesContainer = document.getElementById('servicesList');
        const div = document.createElement('div');
        div.classList.add('service');
        div.innerHTML = `
          Name: <input type="text" class="service-name" required />
          Duration: <input type="text" class="service-duration" required />
          Price: <input type="number" class="service-price" required />
          <br/>
        `;
        servicesContainer.appendChild(div);
      });
    }
  
    // Final submit
    const salonForm = document.getElementById('salonForm');
    if (salonForm) {
      salonForm.addEventListener('submit', async function (e) {
        e.preventDefault();
  
        try {
          const ownerName = document.getElementById('ownerName').value.trim();
          const ownerPhone = '+91' + document.getElementById('ownerPhone').value.trim();
          const salonName = document.getElementById('salonName').value.trim();
          const address = document.getElementById('address').value.trim();
  
          if (!ownerName || !ownerPhone || !salonName || !address) {
            alert('Please fill all required fields.');
            return;
          }
  
          // Step 1: Create owner
          const ownerRes = await fetch('/api/owners/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: ownerName, number: ownerPhone })
          });
  
          const owner = await ownerRes.json();
          if (!owner.success) return alert('Owner creation failed: ' + owner.message);
  
          // Step 2: Prepare salon data
          const salon = {
            id: crypto.randomUUID(),
            salonName,
            owner: owner.owner._id,
            phone: ownerPhone,
            address,
            services: [],
            workingDays: []
          };
  
          // Services
          document.querySelectorAll('#servicesList .service').forEach(div => {
            salon.services.push({
              name: div.querySelector('.service-name').value.trim(),
              duration: div.querySelector('.service-duration').value.trim(),
              price: parseFloat(div.querySelector('.service-price').value)
            });
          });
  
          // Working Days
          workingDays.forEach(day => {
            salon.workingDays.push({
              day: day,
              open: document.querySelector(`[name="open-${day}"]`).value,
              close: document.querySelector(`[name="close-${day}"]`).value,
              isClosed: document.getElementById(`closed-${day}`).checked
            });
          });
  
          // Step 3: Create salon
          const salonRes = await fetch('/api/salons/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(salon)
          });
  
          const salonResult = await salonRes.json();
          if (!salonResult.success) return alert('Salon registration failed: ' + salonResult.message);
  
          alert('Salon and services registered successfully!');
          localStorage.setItem('ownerId', owner.owner._id);
          window.location.href = 'main_owner.html';
  
        } catch (err) {
          console.error(err);
          alert('Submission failed.');
        }
      });
    }
  });
  