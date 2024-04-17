import { useEffect, useState } from "react";
import db from "../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

const useSnapshot = () => {
  const [newPost, setNewPost] = useState({});
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "/users/TestIdIdIdIdIdId/post"),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();

            setNewPost(data);
          }
        }),
          (error) => {
            console.log(error);
          };
      }
    );

    return () => unsubscribe(); // 在組件卸載時取消訂閱
  }, []);
  return newPost;
};

const useFirestoreData = (path) => {
  const [userPostData, setUserPostData] = useState(null);
  const newPost = useSnapshot();
  useEffect(() => {
    const fetchUserPostData = async () => {
      try {
        const collectionRef = collection(db, path);
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
  }, [newPost]);

  return userPostData;
};

export default useFirestoreData;
