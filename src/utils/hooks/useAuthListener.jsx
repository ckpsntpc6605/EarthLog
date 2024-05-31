import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
function useAuthListener() {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const uid = user.uid;
          const token = await user.getIdToken();
          setCurrentUser({ id: uid, email: user.email, token });
        } else {
          setCurrentUser({});
          console.log("User is signed out");
        }
      } catch (e) {
        console.log(e);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return currentUser;
}

export default useAuthListener;
