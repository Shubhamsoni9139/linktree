import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBGkMjoDku5mTLFlwXsowr5MAzYVjbQEJU",
  authDomain: "linkme-fd10e.firebaseapp.com",
  projectId: "linkme-fd10e",
  storageBucket: "linkme-fd10e.firebasestorage.app",
  messagingSenderId: "221099013066",
  appId: "1:221099013066:web:c6334e24db0cb0cfc69533",
  measurementId: "G-T9BK8YKTHK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;