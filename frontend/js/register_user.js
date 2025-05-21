document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const gender = document.getElementById("gender").value;
    const location = document.getElementById("location").value;
    //const phone = document.getElementById("phone").value;
    const phone = "+91" + document.getElementById("phone").value; // Assuming the phone number is in Indian format
  
    const responseMsg = document.getElementById("responseMsg");
    responseMsg.textContent = "Processing...";
  
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, gender, location,phone })
      });
  
      const data = await res.json();
  
      if (data.success) {
        responseMsg.style.color = "green";
        responseMsg.textContent = "✅ " + data.message;
        document.getElementById("registerForm").reset();
      } else {
        responseMsg.style.color = "red";
        responseMsg.textContent = "❌ " + data.message;
      }
    } catch (error) {
      responseMsg.style.color = "red";
      responseMsg.textContent = "⚠️ Server error. Please try again.";
    }

    // Optionally, you can redirect the user to another page after successful registration
    document.getElementById("register-btn").addEventListener("click", () => {
      // Example: Assume registration successful
      redirectToMainUser();
    });
    
    function redirectToMainUser() {
      // After successful registration
      window.location.href = "main_user.html";
    }
    
    
  });
  