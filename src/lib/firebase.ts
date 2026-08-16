import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, get, onValue } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCTo-tx-y4FAzgdK_8xEa8yKuUGgiWfu3w",
  authDomain: "jafu-f5c61.firebaseapp.com",
  projectId: "jafu-f5c61",
  storageBucket: "jafu-f5c61.firebasestorage.app",
  messagingSenderId: "443188416465",
  appId: "1:443188416465:web:ff7bcc995b83aab0f1daf0",
  measurementId: "G-KMKGFCKSNN",
  databaseURL: "https://jafu-f5c61-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

export const analyticsPromise = isSupported()
  .then((supported) => (supported ? getAnalytics(app) : null))
  .catch(() => null);

const CONFIG_DOC_PATH = ["websiteConfig", "main"] as const;
const RTDB_PATH = "jafu";

/** Upload file to Firebase Storage under jafu/images/{category}/{filename} */
export async function uploadFileToFirebaseStorage(
  file: File,
  category: string = "general"
): Promise<string> {
  const sanitizedCategory = category.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const sRef = storageRef(storage, `jafu/images/${sanitizedCategory}/${fileName}`);

  await uploadBytes(sRef, file);
  const downloadUrl = await getDownloadURL(sRef);
  return downloadUrl;
}

/** Save website customization data to Firebase Realtime Database & Cloud Firestore */
export async function saveWebsiteStateToFirebase(data: any): Promise<void> {
  try {
    // 1. Save to Firebase Realtime Database
    const rRef = dbRef(database, RTDB_PATH);
    await set(rRef, data);
  } catch (err) {
    console.warn("Firebase Realtime Database save warning:", err);
  }

  try {
    // 2. Save to Cloud Firestore
    const fRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
    await setDoc(fRef, data, { merge: true });
  } catch (err) {
    console.warn("Cloud Firestore save warning:", err);
  }
}

/** Fetch website customization data from Firebase Realtime Database */
export async function loadWebsiteStateFromRealtimeDB(): Promise<any | null> {
  try {
    const rRef = dbRef(database, RTDB_PATH);
    const snap = await get(rRef);
    if (snap.exists() && snap.val() !== null) {
      return snap.val();
    }
  } catch (err) {
    console.warn("Firebase Realtime Database load warning:", err);
  }
  return null;
}

/** Subscribe to real-time updates from Firebase Realtime Database */
export function subscribeToRealtimeDBWebsiteData(callback: (data: any) => void): () => void {
  try {
    const rRef = dbRef(database, RTDB_PATH);
    const unsubscribe = onValue(rRef, (snapshot) => {
      if (snapshot.exists() && snapshot.val() !== null) {
        callback(snapshot.val());
      }
    });
    return unsubscribe;
  } catch (err) {
    console.warn("Firebase Realtime Database subscription warning:", err);
    return () => {};
  }
}

/** Fallback Cloud Firestore functions */
export async function loadWebsiteStateFromFirestore(): Promise<any | null> {
  try {
    const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn("Firestore load warning:", err);
  }
  return null;
}

export function subscribeToFirestoreWebsiteData(callback: (data: any) => void): () => void {
  try {
    const docRef = doc(db, CONFIG_DOC_PATH[0], CONFIG_DOC_PATH[1]);
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        callback(snap.data());
      }
    });
  } catch (err) {
    console.warn("Firestore subscription warning:", err);
    return () => {};
  }
}
