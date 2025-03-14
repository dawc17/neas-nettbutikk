import { createContext, useState, useContext, useEffect } from "react";
import { useProducts } from "../data/ProductsData";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItemsMap, setCartItemsMap] = useState({}); // Format: { productId: quantity }
  const [showNotification, setShowNotification] = useState(false);
  const { products, loading } = useProducts();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCartItemsMap(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItemsMap));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItemsMap]);

  // Create full cart items with product details when products or cart changes
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
      .filter(Boolean); // Filter out any null items (products not found)

    setCartItems(items);
  }, [cartItemsMap, products, loading]);

  const addToCart = (product) => {
    // Handle the quantity specified in the product object
    const quantityToAdd = product.quantity || 1;

    setCartItemsMap((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + quantityToAdd,
    }));

    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItemsMap((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  const removeFromCart = (productId) => {
    setCartItemsMap((prev) => {
      const newMap = { ...prev };
      delete newMap[productId];
      return newMap;
    });
  };

  const clearCart = () => {
    setCartItemsMap({});
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
