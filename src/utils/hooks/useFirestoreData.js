import { useEffect, useState } from "react";
import db from "../firebase";
import { collection, getDocs, onSnapshot, doc } from "firebase/firestore";
import useAuthListener from "./useAuthListener";

export function useUserData(uid) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  return userData;
}

const useSnapshot = () => {
  const currentUser = useAuthListener();
  const [newPost, setNewPost] = useState({});
  if (currentUser) {
    useEffect(() => {
      const unsubscribe = onSnapshot(
        collection(db, `/users/${currentUser.id}/post`),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data = change.doc.data();

              setNewPost(data);
            } else if (change.type === "modified") {
              const data = change.doc.data();
              setNewPost(data);
              console.log("Document modified:", data);
            }
          }),
            (error) => {
              console.log(error);
            };
        }
      );

      return () => unsubscribe(); // 在組件卸載時取消訂閱
    }, [currentUser]);
  }

  return newPost;
};

const useFirestoreData = () => {
  const [userPostData, setUserPostData] = useState(null);
  const newPost = useSnapshot();
  const currentUser = useAuthListener();
  if (currentUser) {
    useEffect(() => {
      const fetchUserPostData = async () => {
        try {
          const collectionRef = collection(db, `/users/${currentUser.id}/post`);
          const querySnapshot = await getDocs(collectionRef);
          const documentsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPostData(documentsData);
        } catch (err) {
          console.log(err);
        }
      };

      fetchUserPostData();
    }, [newPost, currentUser]);
  }

  return userPostData;
};

export default useFirestoreData;
