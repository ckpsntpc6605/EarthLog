import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBWYUD2Ge0EcKNFYIFRsvzD-q6AbFUem_A",
  authDomain: "earthlog-240dd.firebaseapp.com",
  projectId: "earthlog-240dd",
  storageBucket: "earthlog-240dd.appspot.com",
  messagingSenderId: "312271974807",
  appId: "1:312271974807:web:25a5a88d0ab87e7afa14d2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
