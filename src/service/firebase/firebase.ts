
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3im2I567nuvZsT5wCgsAO-ahrrk8Eldo",
  authDomain: "eatzaa-1fd86.firebaseapp.com",
  projectId: "eatzaa-1fd86",
  storageBucket: "eatzaa-1fd86.firebasestorage.app",
  messagingSenderId: "628049608572",
  appId: "1:628049608572:web:8308e9f4994430d80eaef9",
  measurementId: "G-Y1PBFH4166"
};

// Initialize Firebase

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export {app,auth}