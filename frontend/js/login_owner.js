import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Firebase Config
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

// reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
  size: "normal",
  callback: (response) => {
    console.log("reCAPTCHA verified");
  },
}, auth);

let confirmationResult;
  
  window.verifyOTP = (type) => {
    const otpInput = document.getElementById("ownerOTP");
    const otp = otpInput.value;
  
    confirmationResult.confirm(otp)
      .then((result) => {
        const user = result.user;
        const phone = user.phoneNumber;
  
        fetch('/api/auth/check-phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone })
        })
          .then(res => res.json())
          .then(data => {
            if (data.exists && data.role === 'owner') {
              localStorage.setItem('ownerId', data.ownerId);
              alert("Login successful!");
              window.location.href = 'main_owner.html';
            } else {
              // Redirect to registration with phone saved
              localStorage.setItem('newOwnerPhone', phone);
              window.location.href = 'register_owner.html';
            }
          })
          .catch(err => {
            console.error('Error checking phone:', err);
            alert("Backend error");
          });
  
      })
      .catch((error) => {
        alert("Incorrect OTP");
      });
  };
  



window.sendOTP = (type) => {
  const phoneInput = document.getElementById("ownerPhone");
  const phoneNumber = "+91" + phoneInput.value;

  signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("OTP sent" );
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to send OTP");
    });
};

window.verifyOTP = (type) => {
  const otpInput = document.getElementById("ownerOTP");
  const otp = otpInput.value;

  confirmationResult.confirm(otp)
    .then((result) => {
      const user = result.user;
      const phone = user.phoneNumber;

      fetch('/api/auth/check-phone/owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      .then(res => res.json())
      .then(data => {
        if (data.exists) {
          localStorage.setItem('ownerId', data.ownerId);
          alert("Login successful!");
          window.location.href = 'demo2.html'; // Main page
        } else {
          window.location.href = 'register_owner.html';
        }
      })
      .catch(err => {
        console.error('Error checking phone:', err);
        alert("Backend error");
      });

    })
    .catch((error) => {
      alert("Incorrect OTP");
    });
};
