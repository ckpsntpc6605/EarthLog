import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  query,
  where,
  collectionGroup,
  collection,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

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
export const auth = getAuth(app);
const db = getFirestore(app);

// Get a reference to the storage service, which is used to create references in your storage bucket
const storage = getStorage();

export default db;

export async function storePost(postData, files, id) {
  try {
    const timestamp = Timestamp.now();
    const postDataID = postData.id;
    const userDoc = await getDoc(doc(db, `/users/${id}`));
    const author = await userDoc.data().username;
    const downloadURLs = await storeImages(postDataID, files);
    const postRef = await doc(db, `/users/${id}/post`, postDataID);
    await setDoc(postRef, {
      author: author,
      ...postData,
      createTime: timestamp,
      photos: downloadURLs,
      isPublic: false,
      authorID: id,
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

export function handleSignUp(e, email, password, name) {
  e.preventDefault();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // success
      const user = userCredential.user;
      console.log("User registered successfully:", user);
      alert("注冊成功！");
      setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email: user.email,
        username: name,
        avatar: "",
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error("Registration failed with error:", errorMessage);
    });
}

export function handleLogin(e, email, password) {
  e.preventDefault();
  let result = "";
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // success
      const user = userCredential.user;
      console.log("User signed in successfully:", user);
      result = "登入成功！";
      alert("登入成功！");
    })
    .catch((error) => {
      const errorMessage = error.message;
      result = "登入失敗！";
      console.error("Sign in failed with error:", errorMessage);
    });
  return result;
}

export async function updatePostIsPublic(userId, postId, boolean) {
  const postRef = doc(db, `users/${userId}/post/${postId}`);
  try {
    await setDoc(postRef, { isPublic: boolean }, { merge: true });
    console.log("Post isPublic updated successfully!");
    boolean ? alert("發布成功！") : alert("取消發布成功");
  } catch (error) {
    console.error("Error updating post isPublic:", error);
    alert("發布失敗:(");
  }
}

export async function handleSignOut() {
  try {
    await auth.signOut();
    console.log("登出成功");
  } catch (error) {
    console.error("Sign out error:", error);
  }
}

export async function getPublicPosts() {
  try {
    const q = query(collectionGroup(db, "post"), where("isPublic", "==", true));

    const querySnapshot = await getDocs(q);
    let publicPost = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      publicPost.push(doc.data());
    });
    return publicPost;
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}

async function storeAvatar(uid, photo) {
  let downloadURL;
  try {
    const photoRef = ref(storage, `/users/${uid}/${photo.name}`);
    const metadata = {
      contentType: photo.type,
    };
    const snapshot = await uploadBytesResumable(photoRef, photo, metadata);
    const url = await getDownloadURL(snapshot.ref);
    downloadURL = url;
  } catch (error) {
    console.error("Error uploading file:", error);
  }

  return downloadURL;
}

export async function updateUserAvatar(uid, photo) {
  const postRef = doc(db, `users/${uid}`);
  try {
    const url = await storeAvatar(uid, photo);
    await setDoc(postRef, { avatar: url }, { merge: true });
    console.log("User avatar updated successfully!");
  } catch (error) {
    console.error("Error updating post isPublic:", error);
    alert("發布失敗:(");
  }
}

export async function getSelectedUserProfile(uid) {
  const ref = doc(db, "users", uid);
  try {
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      const userData = snapshot.data();
      return userData;
    } else {
      console.log("查無資料");
      return null;
    }
  } catch (e) {
    console.error("Error getting selected user profile:", error);
    throw Error;
  }
}

export async function handleFollow(uid, data, boolean) {
  console.log(uid);
  const ref = doc(db, "users", uid, "following", data.id);
  let follow_result = false;
  if (boolean) {
    try {
      await setDoc(ref, data);
      console.log("Document successfully written!");
      follow_result = true;
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  } else {
    try {
      await deleteDoc(ref);
      console.log("Document successfully deleted!");
      follow_result = false;
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }
  return follow_result;
}

// export async function getFollowingUsers(uid) {
//   const ref = collection(db, "users", uid, "following");
//   const snapshot = await getDocs(ref);
//   const followingUsers = [];
//   snapshot.forEach((doc) => {
//     followingUsers.push(doc.data());
//   });
//   return followingUsers;
// }

export async function getPostComments(path) {
  const commentsRef = collection(db, path);
  const commentsSnapshot = await getDocs(commentsRef);

  const commentsData = commentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return commentsData;
}

export async function storeComment(authotID, postID, data) {
  const postRef = collection(db, "users", authotID, "post", postID, "comments");
  try {
    const docRef = await addDoc(postRef, data);
    console.log("Comment stored with ID: ", docRef.id);
    return true;
  } catch (e) {
    console.error("Error storing comment:", e);
    return false;
  }
}

export async function removePost(id) {
  const q = query(collectionGroup(db, "post"), where("id", "==", id));
  try {
    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log("Document successfully deleted!");
    });
  } catch (error) {
    console.error("Error removing document: ", error);
  }
}

export async function addNewProject(path) {
  const projectRef = collection(db, path);
  try {
    const docRef = await addDoc(projectRef, {});
    console.log("New project written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}
