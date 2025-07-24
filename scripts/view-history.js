import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const contributionId = params.get("contributionId");

if (!contributionId) {
  alert("Hakuna mchango umechaguliwa.");
  window.location.href = "dashboard.html";
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  loadEntries();
});

const historyList = document.getElementById("historyList");
const totalAmountEl = document.getElementById("totalAmount");
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {
  window.location.href = `dashboard.html`;
});

async function loadEntries() {
  try {
    const q = query(collection(db, "entries"), where("contributionId", "==", contributionId));
    const querySnapshot = await getDocs(q);
    let total = 0;

    querySnapshot.forEach(doc => {
      const data = doc.data();
      total += data.amount;

      const entryDiv = document.createElement("div");
      entryDiv.className = "p-3 border rounded bg-gray-50";
      const thankMessage = `Habari ${data.fullName}, asante sana kwa mchango wako wa ${data.amount.toLocaleString()} TZS. Mungu akubariki sana.`;
const whatsappURL = `https://wa.me/${data.phone.replace(/^0/, '255')}?text=${encodeURIComponent(thankMessage)}`;

entryDiv.innerHTML = `
  <p><strong>Jina:</strong> ${data.fullName}</p>
  <p><strong>Simu:</strong> ${data.phone}</p>
  <p><strong>Kiasi:</strong> ${data.amount.toLocaleString()} TZS</p>
  <a href="${whatsappURL}" target="_blank" class="inline-block mt-2 text-green-600 underline hover:text-green-800">
    Tuma Shukrani WhatsApp
  </a>
`;

      historyList.appendChild(entryDiv);
    });

    totalAmountEl.textContent = total.toLocaleString();
  } catch (error) {
    historyList.innerHTML = `<p class="text-red-600">Kosa: ${error.message}</p>`;
  }
}
const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  doc.setFontSize(16);
  doc.text("Historia ya Michango", 10, y);
  y += 10;

  const q = query(collection(db, "entries"), where("contributionId", "==", contributionId));
  const querySnapshot = await getDocs(q);

  let total = 0;
  querySnapshot.forEach((docSnap, index) => {
    const data = docSnap.data();
    total += data.amount;

    doc.setFontSize(12);
    doc.text(`${index + 1}. ${data.fullName} - ${data.phone} - ${data.amount.toLocaleString()} TZS`, 10, y);
    y += 8;

    if (y > 280) { // Page overflow
      doc.addPage();
      y = 10;
    }
  });

  y += 10;
  doc.setFontSize(14);
  doc.text(`Jumla: ${total.toLocaleString()} TZS`, 10, y);

  doc.save("historia-michango.pdf");
});
