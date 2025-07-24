import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("registerBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const status = document.getElementById("status");

  status.textContent = "";

  if (!email || !password || !confirmPassword) {
    status.textContent = "Tafadhali jaza taarifa zote";
    return;
  }

  if (password !== confirmPassword) {
    status.textContent = "Password haifanani";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      status.style.color = "green";
      status.textContent = "Umefanikiwa kujiandikisha! Tafadhali ingia sasa.";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    })
    .catch((error) => {
      status.style.color = "red";
      status.textContent = "Imeshindikana: " + error.message;
    });
});
