import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const createOrFetchUserDoc = async (user) => {
  if (!user?.uid) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      role: "user",
    });
  }

  return userSnap.exists()
    ? userSnap.data()
    : { email: user.email, role: "user" };
};
