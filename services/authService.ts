import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export async function logoutUser() {
  await signOut(auth);
}

export type HelpRequest = {
  id: string;
  seniorId: string;
  requestType: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
};

export async function getPendingHelpRequests(): Promise<HelpRequest[]> {
  const requestsQuery = query(
    collection(db, "helpRequests"),
    where("status", "==", "Pending"),
  );

  const requestSnapshot = await getDocs(requestsQuery);

  return requestSnapshot.docs.map((requestDocument) => ({
    id: requestDocument.id,
    ...(requestDocument.data() as Omit<HelpRequest, "id">),
  }));
}

export async function getAcceptedHelpRequests(): Promise<HelpRequest[]> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be logged in as a helper.");
  }

  const requestsQuery = query(
    collection(db, "helpRequests"),
    where("helperId", "==", currentUser.uid),
  );

  const requestSnapshot = await getDocs(requestsQuery);

  const requests = requestSnapshot.docs.map((requestDocument) => ({
    id: requestDocument.id,
    ...(requestDocument.data() as Omit<HelpRequest, "id">),
  }));

  return requests.filter(
    (request) =>
      request.status === "Accepted" || request.status === "In Progress",
  );
}

export type UserRole = "Senior" | "Helper" | "Family";

type RegisterUserData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
};

type HelpRequestData = {
  requestType: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
};

export async function createHelpRequest({
  requestType,
  description,
  preferredDate,
  preferredTime,
}: HelpRequestData) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be logged in.");
  }

  const requestDocument = await addDoc(collection(db, "helpRequests"), {
    seniorId: currentUser.uid,
    requestType: requestType.trim(),
    description: description.trim(),
    preferredDate: preferredDate.trim(),
    preferredTime: preferredTime.trim(),
    status: "Pending",
    createdAt: serverTimestamp(),
  });

  return requestDocument.id;
}

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

export async function getUserRole(uid: string) {
  const userDocument = await getDoc(doc(db, "users", uid));

  if (!userDocument.exists()) {
    throw new Error("User profile was not found.");
  }

  const userData = userDocument.data();

  return userData.role as UserRole;
}

export async function acceptHelpRequest(requestId: string) {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be logged in as a helper.");
  }

  const requestReference = doc(db, "helpRequests", requestId);

  await updateDoc(requestReference, {
    status: "Accepted",
    helperId: currentUser.uid,
    acceptedAt: serverTimestamp(),
  });
}

export async function startHelpRequest(requestId: string) {
  const requestReference = doc(db, "helpRequests", requestId);

  await updateDoc(requestReference, {
    status: "In Progress",
    startedAt: serverTimestamp(),
  });
}

export async function completeHelpRequest(requestId: string) {
  const requestReference = doc(db, "helpRequests", requestId);

  await updateDoc(requestReference, {
    status: "Completed",
    completedAt: serverTimestamp(),
  });
}
