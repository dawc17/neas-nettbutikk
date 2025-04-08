import { useState, useEffect, useCallback } from "react";
import { ref, set, get } from "firebase/database";
import { database } from "../utils/firebase";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const productsRef = ref(database, "products");
      const snapshot = await get(productsRef);

      if (snapshot.exists()) {
        const productsArray = Object.values(snapshot.val());
        setProducts(productsArray);
      } else {
        setProducts([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching products: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Force a refresh by incrementing the counter
  const refreshProducts = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, refreshCounter]);

  return { products, loading, error, refreshProducts };
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
