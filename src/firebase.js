// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDS_c4guDVHJNcExp2HiRCZlr9zt9Yv758",
  authDomain: "bluepark-site.firebaseapp.com",
  projectId: "bluepark-site",
  storageBucket: "bluepark-site.appspot.com",
  messagingSenderId: "250526460785",
  appId: "1:250526460785:web:c32d76fcda4564206f64d0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
console.log("🔥 Firebase initialized successfully");
