import { createContext, useContext, useState, useEffect } from "react";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

// Use the existing Firebase config - update with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyDvyh73cj0xDmkVSMrfy8wD1V2C0nL9bzg",
  authDomain: "neas-nettbutikk-cb665.firebaseapp.com",
  projectId: "neas-nettbutikk-cb665",
  storageBucket: "neas-nettbutikk-cb665.firebasestorage.app",
  messagingSenderId: "401615206029",
  appId: "1:401615206029:web:9fbb8df70c18f999f394c4",
  measurementId: "G-404KWWNX03",
  databaseURL:
    "https://neas-nettbutikk-cb665-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase and Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation won't work directly here - we'll create a separate hook

  // Check if user is admin
  const checkUserRole = async (uid) => {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUserRole(userData.role || "user");
        return userData.role || "user";
      }
      return "user";
    } catch (error) {
      console.error("Error checking user role:", error);
      return "user";
    }
  };

  // Login function (without navigation)
  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const role = await checkUserRole(userCredential.user.uid);
    return { user: userCredential.user, role };
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await checkUserRole(user.uid);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    isAdmin: userRole === "admin",
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}