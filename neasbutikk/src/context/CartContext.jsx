import { createContext, useState, useContext, useEffect } from "react";
import { useProducts } from "../data/ProductsData";
import { useAuth } from "../context/AuthContext";
import { ref, set, onValue } from "firebase/database";
import { database } from "../utils/firebase";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItemsMap, setCartItemsMap] = useState({}); // { productId: quantity }
  const [showNotification, setShowNotification] = useState(false);
  const { products, loading } = useProducts();
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();

  // Load cart data when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      // User is logged in - set up Firebase listener
      const userCartRef = ref(database, `users/${currentUser.uid}/cart`);

      const unsubscribe = onValue(userCartRef, (snapshot) => {
        const firebaseCart = snapshot.val() || {};
        setCartItemsMap(firebaseCart);
      });

      return () => unsubscribe();
    } else {
      // No user - load from localStorage
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItemsMap(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, [currentUser]);

  // Save cart to localStorage when it changes (for non-logged in users)
  useEffect(() => {
    if (!currentUser) {
      try {
        localStorage.setItem("cart", JSON.stringify(cartItemsMap));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cartItemsMap, currentUser]);

  // Convert cart items map to full product objects
  useEffect(() => {
    if (loading || !products.length) return;

    const items = Object.entries(cartItemsMap)
      .map(([id, quantity]) => {
        const product = products.find((p) => p.id === id);
        if (!product) return null;

        return {
          ...product,
          quantity,
        };
      })
      .filter(Boolean);

    setCartItems(items);
  }, [cartItemsMap, products, loading]);

  // Update cart in Firebase or localStorage
  const updateCartData = (newCart) => {
    setCartItemsMap(newCart);

    if (currentUser) {
      // Update in Firebase
      const userCartRef = ref(database, `users/${currentUser.uid}/cart`);
      set(userCartRef, newCart);
    }
  };

  const addToCart = (product) => {
    const quantityToAdd = product.quantity || 1;

    const newCart = {
      ...cartItemsMap,
      [product.id]: (cartItemsMap[product.id] || 0) + quantityToAdd,
    };

    updateCartData(newCart);

    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const newCart = {
      ...cartItemsMap,
      [productId]: newQuantity,
    };

    updateCartData(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = { ...cartItemsMap };
    delete newCart[productId];

    updateCartData(newCart);
  };

  const clearCart = () => {
    updateCartData({});
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return Object.values(cartItemsMap).reduce(
      (count, quantity) => count + quantity,
      0
    );
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    showNotification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
