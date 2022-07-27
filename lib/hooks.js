import { auth, firestore } from "../lib/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    //listening for changes to the user object
    //turn off realtime subscription(stops listening
    //for changes when called)
    let unsubscribe;

    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }
    // tells react to call unsubscribe when user doc is
    // no longer needed
    return unsubscribe;
  }, [user]);

  return { user, username };
}
