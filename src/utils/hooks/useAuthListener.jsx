import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
function useAuthListener() {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setCurrentUser({ id: uid, email: user.email });

        // console.log("User is signed in with UID:", uid);
      } else {
        setCurrentUser({});
        console.log("User is signed out");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return currentUser;
}

export default useAuthListener;
