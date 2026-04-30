import { auth, db } from "@/utils/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const adminLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    try {
      const adminDocRef = doc(db, "authorized_users", user.uid);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists() && adminDoc.data().role === 'admin') {
        return { user, role: 'admin' };
      }
    } catch (firestoreError: any) {
      if (firestoreError.code === 'permission-denied') {
        await signOut(auth);
        throw new Error("Access Denied: You are not on the authorized list.");
      }
      throw firestoreError;
    }

    await signOut(auth);
    throw new Error("Unauthorized.");

  } catch (error: any) {
    console.error("Login failed:", error.message);
    throw error;
  }
};
