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

const contributionForm = document.getElementById("contributionForm");
const status = document.getElementById("status");
const backBtn = document.getElementById("backBtn");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

contributionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "";
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title) {
    status.textContent = "Tafadhali jaza jina la mchango.";
    return;
  }

  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "contributions"), {
      title,
      description,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    });
    status.style.color = "green";
    status.textContent = "Mchango umehifadhiwa kwa mafanikio!";
    contributionForm.reset();
  } catch (error) {
    status.style.color = "red";
    status.textContent = "Kosa: " + error.message;
  }
});
