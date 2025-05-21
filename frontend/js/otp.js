// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

//  Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBY7iZ6_U0dUlkDz016feLG2qsrnewDuRE",
    authDomain: "hairsphere-2026.firebaseapp.com",
    projectId: "hairsphere-2026",
    storageBucket: "hairsphere-2026.firebasestorage.app",
    messagingSenderId: "682905411472",
    appId: "1:682905411472:web:cf15cab903740032821d15",
    measurementId: "G-6K8MLE2DXW"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
  size: "normal",
  callback: (response) => {
    console.log("reCAPTCHA resolved");
  },
}, auth);

let confirmationResult;

window.sendOTP = (type) => {
  const phoneInput = type === 'user' ? document.getElementById("userPhone") : document.getElementById("ownerPhone");
  const phoneNumber = "+91" + phoneInput.value;

  signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("OTP sent!");
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to send OTP");
    });
};

window.verifyOTP = (type) => {
  const otpInput = type === 'user' ? document.getElementById("userOTP") : document.getElementById("ownerOTP");
  const otp = otpInput.value;

  confirmationResult.confirm(otp)
  .then((result) => {
    const user = result.user;
    const phone = user.phoneNumber;

    // Call backend to check if user exists
    fetch('/api/auth/check-phone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone })
    })
    .then(res => res.json())
    .then(data => {
      if (data.exists) {
        localStorage.setItem('userId', data.userId); // Save login
        alert("Login successful!");
        // window.location.href = 'user_main.html'; // redirect to dashboard
      } else {
        alert("User not found. Redirecting to registration.");
        // redirect to registration
        window.location.href = 'register_user.html';
      }
    })
    .catch(err => {
      console.error('Error checking user:', err);
      alert("Something went wrong.");
    });
  })
  .catch((error) => {
    alert("Incorrect OTP");
  });

};

function checkPhoneNumberInDB(phoneNumber) {
  fetch('/api/check-phone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone: phoneNumber })
  })
  .then(response => response.json())
  .then(data => {
    if (data.exists) {
      // Login successful — redirect to dashboard
      window.location.href = '/customer-dashboard';
    } else {
      // Phone number not found — redirect to registration
      window.location.href = '/register';
    }
  })
  .catch(error => {
    console.error('Error checking phone number:', error);
  });
}


// Function to handle login for both user and owner
window.login = async (type) => {
  // Check if the user has already logged in
  const userId = localStorage.getItem('userId');
  const ownerId = localStorage.getItem('ownerId');
  if (userId || ownerId) {
    alert('You are already logged in!');
    return;
  }
};