import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrUu2xkQ_FAWt-EA_BjBmhmpzvt814DYA",
  authDomain: "nwitter-reloaded-24ada.firebaseapp.com",
  projectId: "nwitter-reloaded-24ada",
  storageBucket: "nwitter-reloaded-24ada.appspot.com",
  messagingSenderId: "625468274821",
  appId: "1:625468274821:web:763703f89f13cb7e8ad1ec"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);