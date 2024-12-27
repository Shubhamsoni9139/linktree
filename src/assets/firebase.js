// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGkMjoDku5mTLFlwXsowr5MAzYVjbQEJU",
  authDomain: "linkme-fd10e.firebaseapp.com",
  projectId: "linkme-fd10e",
  storageBucket: "linkme-fd10e.firebasestorage.app",
  messagingSenderId: "221099013066",
  appId: "1:221099013066:web:c6334e24db0cb0cfc69533",
  measurementId: "G-T9BK8YKTHK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
