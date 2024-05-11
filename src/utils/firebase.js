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
  updateDoc,
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

export async function storePost(postData, files, id, canvasimgs) {
  try {
    const timestamp = Timestamp.now();
    const postDataID = postData.id;
    const userDoc = await getDoc(doc(db, `/users/${id}`));
    const author = await userDoc.data().username;
    const downloadURLs = await storeImages(postDataID, files);
    const canvasImgUrl = await storeCanvasImages(postDataID, canvasimgs);
    const postRef = await doc(db, `/users/${id}/post`, postDataID);
    await setDoc(postRef, {
      author: author,
      ...postData,
      createTime: timestamp,
      photos: downloadURLs,
      isPublic: false,
      authorID: id,
      canvasImg: canvasImgUrl,
    });
    console.log("Post added with ID: ", postDataID);
    return { result: true, postDataID: postDataID };
  } catch (e) {
    console.log(e);
    return { result: false, postDataID: null };
  }
}
function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

async function storeCanvasImages(id, imageDataURLs) {
  const downloadURLs = [];
  for (const imageDataURL of imageDataURLs) {
    try {
      const blob = dataURItoBlob(imageDataURL);
      const fileRef = ref(storage, `canvas_images/${id}/${Date.now()}.png`);
      const metadata = { contentType: "image/png" };
      const snapshot = await uploadBytesResumable(fileRef, blob, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      downloadURLs.push(downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
  return downloadURLs;
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

export async function updatePost(postData, files, canvasimgs) {
  try {
    const timestamp = Timestamp.now();
    const postDataID = postData.id;
    const downloadURLs = await updateNewContentImages(postDataID, files);
    const canvasImgUrl = await storeMixedImages(postDataID, canvasimgs);
    const postRef = doc(db, `/users/${postData.authorID}/post`, postDataID); // 不用 await
    await updateDoc(postRef, {
      ...postData,
      createTime: timestamp,
      photos: downloadURLs,
      canvasImg: canvasImgUrl,
    });
    console.log("Post updated with ID: ", postDataID);
    return { result: true, postDataID: postDataID };
  } catch (e) {
    console.log(e);
    return { result: false, postDataID: null };
  }
}

function isDataURL(str) {
  //檢查是否為base64
  return str.startsWith("data:");
}

async function storeMixedImages(id, mixedImageData) {
  const downloadURLs = [];
  for (const imageData of mixedImageData) {
    try {
      let imageURL;
      if (isDataURL(imageData)) {
        // 如果是 base64 數據，則直接上傳
        const blob = dataURItoBlob(imageData);
        const fileRef = ref(storage, `canvas_images/${id}/${Date.now()}.png`);
        const metadata = { contentType: "image/png" };
        const snapshot = await uploadBytesResumable(fileRef, blob, metadata);
        imageURL = await getDownloadURL(snapshot.ref);
      } else {
        // 如果是 URL，則直接添加到下載 URL 列表中
        imageURL = imageData;
      }
      downloadURLs.push(imageURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
  return downloadURLs;
}

async function updateNewContentImages(id, files) {
  const downloadURLs = [];
  for (const eachFile of files) {
    let fileData;
    if (typeof eachFile === "string") {
      // 如果是 URL 或 Base64 字符串，直接將其視為檔案的資料
      fileData = eachFile;
    } else if (eachFile instanceof File) {
      // 如果是 File 物件，進行上傳處理
      try {
        const fileRef = ref(storage, `post_images/${id}/${eachFile.name}`);
        const metadata = {
          contentType: eachFile.type,
        };
        const snapshot = await uploadBytesResumable(
          fileRef,
          eachFile,
          metadata
        );
        fileData = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.error("Invalid file:", eachFile);
      continue;
    }

    downloadURLs.push(fileData);
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
      alert("註冊成功！");
      setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email: user.email,
        username: name,
        avatar: "",
        everLogin: false,
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error("Registration failed with error:", errorMessage);
    });
}

export async function handleLogin(e, email, password) {
  e.preventDefault();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // 登錄成功
    const user = userCredential.user;
    console.log("User signed in successfully:", user);
    return true;
  } catch (error) {
    // 登錄失敗
    const errorMessage = error.message;
    console.error("Sign in failed with error:", errorMessage);
    return false;
  }
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
  const followingRef = doc(db, "users", uid, "following", data.id);
  const followerRef = doc(db, "users", data.id, "followers", uid); //被關注的人，增加follower
  let follow_result = false;
  if (boolean) {
    try {
      await setDoc(followingRef, data);
      await setDoc(followerRef, {});
      console.log("Document successfully written!");
      follow_result = true;
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  } else {
    try {
      await deleteDoc(followingRef);
      await deleteDoc(followerRef);
      console.log("Document successfully deleted!");
      follow_result = false;
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }
  return follow_result;
}

export async function getFollowers(uid) {
  try {
    const followersRef = collection(doc(db, "users", uid), "followers");
    const snapshot = await getDocs(followersRef);
    const followers = [];
    snapshot.forEach((doc) => {
      followers.push(doc.id);
    });
    return followers;
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
}

export async function getPostComments(path) {
  const commentsRef = collection(db, path);
  const commentsSnapshot = await getDocs(commentsRef);

  const commentsData = commentsSnapshot.docs.map((doc) => ({
    commentID: doc.id,
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

export async function deleteComment(path) {
  const ref = doc(db, path);
  try {
    await deleteDoc(ref);
    console.log("Delete comment successfully!!");
    return true;
  } catch (e) {
    console.log("Delete comment fail:", e);
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
    const docRef = await addDoc(projectRef, {
      dayPlan: [{ day1: [] }],
      prepareList: [],
      country: "",
      projectName: "",
      date: "",
      endDate: "",
      tickets: [],
      destinations: [],
    });
    console.log("New project written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}
export async function addNewDayPlan(path) {
  //collection
  const dayPlanRef = doc(db, path);
  try {
    console.log("有嗎");
    const docRef = await setDoc(dayPlanRef, {
      prepareList: [],
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function saveProject(path, data) {
  const projectRef = doc(db, path);
  try {
    await setDoc(projectRef, data);
    // console.log("Document successfully written!");
  } catch (e) {
    console.error("Error writing document: ", e);
  }
}

export async function deleteProject(path) {
  const projectRef = doc(db, path);
  try {
    await deleteDoc(projectRef);
    console.log("Success delete project");
    return true;
  } catch (e) {
    console.error("Error deleteing document: ", e);
    return false;
  }
}

export async function getAllProjectData(path) {
  const projectRef = collection(db, path);
  try {
    const docSnapshot = await getDocs(projectRef);
    const projectData = docSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return projectData;
  } catch (e) {
    console.error("Error getting document: ", e);
    return null;
  }
}

export async function getProjectData(path) {
  const projectRef = doc(db, path);
  try {
    const docSnapshot = await getDoc(projectRef);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    return null;
  }
}

export async function collectPost(path) {
  const ref = doc(db, path);
  try {
    const docRef = await setDoc(ref, {});
    console.log("Saved the post!!");
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
export async function cancelCollect(path) {
  const ref = doc(db, path);
  try {
    await deleteDoc(ref);
    console.log("Document successfully deleted!");
  } catch (e) {
    console.log("Error ! Document delete fail", e);
  }
}

export async function getCollectedPost(path) {
  const ref = collection(db, path);
  try {
    const docSnapshot = await getDocs(ref);
    const collectedPosts = docSnapshot.docs.map((doc) => doc.id);
    return collectedPosts;
  } catch (e) {
    console.log(e);
  }
}

export async function getDayPlansData(path) {
  const dayPlanRef = doc(db, path); // 使用 doc 函數
  const snapshot = await getDoc(dayPlanRef); // 使用 getDoc 函數
  if (snapshot.exists()) {
    const dayPlanData = { id: snapshot.id, ...snapshot.data() };
    return dayPlanData;
  } else {
    console.log("Document not found");
    return null;
  }
}

export async function saveDayPlansPrepareList(path, data) {
  const docRef = doc(db, path);
  try {
    await setDoc(docRef, data);
    console.log("saveDayPlansPrepareList successfully!");
  } catch (e) {
    console.error("Error updating document: ", e);
  }
}

export async function handleIsFirstLogin(path) {
  const ref = doc(db, path);
  try {
    await updateDoc(ref, {
      everLogin: true,
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
}
