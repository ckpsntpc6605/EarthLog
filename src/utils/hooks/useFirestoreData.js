import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
            } else if (change.type === "removed") {
              const deletedData = change.doc.data();
              setNewPost(deletedData);
              console.log("Document deleted:", deletedData);
            }
          }),
            (error) => {
              console.log(error);
            };
        }
      );

      return () => unsubscribe();
    }, [currentUser]);
  }

  return newPost;
};

const useGetCurrentUserPosts = () => {
  const [userPostData, setUserPostData] = useState(null);
  const currentUser = useAuthListener();
  const newPost = useSnapshot();
  useEffect(() => {
    if (!currentUser) {
      setUserPostData(null);
      return;
    }
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

  return userPostData;
};

export default useGetCurrentUserPosts;

export function useOnFollingSnapshot() {
  const currentUser = useAuthListener();
  const [followingUsers, setFollowingUsers] = useState([]);
  if (currentUser) {
    useEffect(() => {
      const unsubscribe = onSnapshot(
        collection(db, `/users/${currentUser.id}/following`),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data = change.doc.data();

              setFollowingUsers((prevFollowing) => [...prevFollowing, data]);
            } else if (change.type === "removed") {
              const deletedData = change.doc.data();
              setFollowingUsers((prevFollowing) =>
                prevFollowing.filter((peruser) => peruser.id !== deletedData.id)
              );
              console.log("Document deleted:", deletedData);
            }
          }),
            (error) => {
              console.log(error);
            };
        }
      );

      return () => unsubscribe();
    }, [currentUser]);
  }

  return { followingUsers, setFollowingUsers };
}

export function useGetSelectedUserPost(id) {
  const [userPosts, setUserPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = collection(db, `/users/${id}/post`);
        const querySnapshot = await getDocs(collectionRef);
        const documentsData = querySnapshot.docs
          .filter((doc) => doc.data().isPublic === true)
          .map((doc) => ({
            ...doc.data(),
          }));
        setUserPosts(documentsData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

  return userPosts;
}

export function useProjectSnapshot() {
  const [projectContent, setNewProjectContent] = useState({});
  const { id } = useParams();
  const currentUser = useAuthListener();
  useEffect(() => {
    const projectRef = doc(db, `/users/${currentUser.id}/travelProject/${id}`);

    const unsubscribe = onSnapshot(
      projectRef,
      (snapshot) => {
        const data = snapshot.data();
        setNewProjectContent(data);
      },
      (error) => {
        console.log("監聽器發生錯誤：", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser, id]);

  return projectContent;
}

export function useGetFireStoreDoc(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, path);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            setData(snapshot.data());
            setError(null);
          } else {
            setData(null);
            setError(null);
          }
        } catch (error) {
          setError(error);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError(err);
        setIsLoading(false);
        setData(null);
      }
    );

    return () => unsubscribe();
  }, [path]);

  return { data, error, isLoading };
}

export const useGetFireStoreDocs = (path) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, path);
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        try {
          const fetchedData = snapshot.docs.map((doc) => ({
            docID: doc.id,
            ...doc.data(),
          }));
          setData(fetchedData);
          setIsLoading(false);
        } catch (error) {
          setError(error.message);
          setIsLoading(false);
          setData(null);
        }
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [path]);

  return { data, isLoading, error };
};
