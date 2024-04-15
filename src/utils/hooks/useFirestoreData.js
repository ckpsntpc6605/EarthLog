import { useEffect, useState } from "react";
import db from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const useFirestoreData = (path) => {
  const [userPostData, setUserPostData] = useState(null);

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
  }, []);

  return userPostData;
};

export default useFirestoreData;
