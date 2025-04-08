import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration - note the correct case for databaseURL (uppercase URL)
const firebaseConfig = {
  apiKey: "AIzaSyBjFJ9baaP0EKFhG_lOHyKfCm4WLF9i22A",
  authDomain: "neas-sigma.firebaseapp.com",
  projectId: "neas-sigma",
  storageBucket: "neas-sigma.firebasestorage.app",
  messagingSenderId: "892721268795",
  appId: "1:892721268795:web:94611d729dced590bb341e",
  databaseURL: "https://neas-sigma-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase - only initialize once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { app, auth, database, analytics };