import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

// Create a storage reference from our storage service
const storageRef = ref(storage);
export default db;

export async function storePost(postData, files) {
  try {
    const timestamp = Timestamp.now();
    const postDataID = postData.id;
    const downloadURLs = await storeImages(postDataID, files);
    const postRef = doc(db, "/users/TestIdIdIdIdIdId/post", postDataID);
    await setDoc(postRef, {
      author: "Marce",
      ...postData,
      createTime: timestamp,
      photos: downloadURLs,
      isPublic: false,
    });
    console.log("Post added with ID: ", postDataID);
  } catch (e) {
    console.log(e);
  }
}

async function storeImages(id, files) {
  const downloadURLs = [];
  for (const eachFile of files) {
    try {
      const fileRef = ref(storage, `post_images/${id}/${eachFile.name}`);
      const metadata = {
        contentType: eachFile.type,
      };
      const snapshot = await uploadBytesResumable(fileRef, eachFile, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      downloadURLs.push(downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
  return downloadURLs;
}
