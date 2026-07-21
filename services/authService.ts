import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export type UserRole = "Senior" | "Helper" | "Family";

type RegisterUserData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
};

export async function registerUser({
  name,
  email,
  phone,
  password,
  role,
}: RegisterUserData) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role,
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  return userCredential.user;
}
