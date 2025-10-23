// // src/hooks/useAuth.js
// import { useEffect, useState } from "react";
// import { auth, onAuthStateChanged } from "../firebaseConfig";

// export default function useAuth() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       setUser(firebaseUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return { user, loading };
// }

// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../firebaseConfig";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
