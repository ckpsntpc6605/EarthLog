import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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
const db = getFirestore(app);
export default db;

export async function getPostData(postID) {
  try {
    const docRef = doc(db, postID);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    }
  } catch (err) {
    console.log(err);
  }
}
