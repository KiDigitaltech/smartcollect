import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get contributionId from URL
const params = new URLSearchParams(window.location.search);
const contributionId = params.get("contributionId");

if (!contributionId) {
  alert("Hakuna mchango umechaguliwa.");
  window.location.href = "dashboard.html";
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

const entryForm = document.getElementById("entryForm");
const status = document.getElementById("status");
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {
  window.location.href = `dashboard.html`;
});

entryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";

  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);

  if (!fullName || !phone || !amount || amount <= 0) {
    status.textContent = "Tafadhali jaza taarifa zote kwa usahihi.";
    return;
  }

  try {
    await addDoc(collection(db, "entries"), {
      fullName,
      phone,
      amount,
      contributionId,
      timestamp: serverTimestamp()
    });

    status.style.color = "green";
    status.textContent = "Mchangiaji ameongezwa kwa mafanikio!";
    entryForm.reset();
  } catch (error) {
    status.style.color = "red";
    status.textContent = "Kosa: " + error.message;
  }
});
