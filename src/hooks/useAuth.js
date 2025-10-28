import { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../firebaseConfig";
import { createOrFetchUserDoc } from "../utils/userHelpers";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (user) {
      createOrFetchUserDoc(user)
        .then((data) => {
          setUserRole(data.role);
        })
        .catch((err) => {
          console.error("Failed to create/fetch user doc:", err);
        });
    } else {
      setUserRole(null);
    }
  }, [user]);

  return { user, loading, userRole };
}
