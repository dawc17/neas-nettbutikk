import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get } from "firebase/database";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = ref(database, "products");
        const snapshot = await get(productsRef);

        if (snapshot.exists()) {
          // Convert from Firebase object to array
          const productsArray = Object.values(snapshot.val());
          setProducts(productsArray);
        } else {
          setProducts([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products: ", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const getProducts = async () => {
  try {
    const productsRef = ref(database, "products");
    const snapshot = await get(productsRef);

    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    }
    return [];
  } catch (error) {
    console.error("Error in getProducts: ", error);
    throw error;
  }
};
