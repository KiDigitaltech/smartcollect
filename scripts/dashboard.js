// scripts/dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  where,
  query
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Hariri contribution
window.editContribution = async function (id, oldTitle) {
  const newTitle = prompt("Badilisha jina la mchango:", oldTitle);
  if (newTitle && newTitle.trim() !== "") {
    try {
      await updateDoc(doc(db, "contributions", id), {
        title: newTitle.trim()
      });
      alert("Jina limebadilishwa.");
      location.reload();
    } catch (error) {
      console.error("Error kubadilisha jina:", error);
      alert("Imeshindikana kubadilisha jina. Tafadhali jaribu tena.");
    }
  }
};

// Futa contribution na entries zake
window.deleteContribution = async function (id) {
  if (confirm("Una uhakika unataka kufuta mchango huu pamoja na taarifa zote zake?")) {
    try {
      // Futa entries zinazohusiana
      const entriesQuery = query(collection(db, "entries"), where("contributionId", "==", id));
      const entriesSnapshot = await getDocs(entriesQuery);

      const deletionPromises = entriesSnapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));

      // Subiri entries zote zifutwe
      await Promise.all(deletionPromises);

      // Futa contribution yenyewe
      await deleteDoc(doc(db, "contributions", id));

      alert("Mchango umefutwa kikamilifu.");
      location.reload();
    } catch (error) {
      console.error("Error kufuta mchango:", error);
      alert("Kufuta mchango kumeleta shida. Jaribu tena.");
    }
  }
};
