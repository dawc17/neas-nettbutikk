import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import ProductOverlay from "./ProductOverlay";

const getFavoriteFromStorage = (productId) => {
  if (!productId || typeof window === "undefined" || !window.localStorage)
    return false;
  try {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return !!favorites[productId];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return false;
  }
};

const cleanupFavorites = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
    const cleanedFavorites = Object.entries(favorites).reduce(
      (acc, [key, value]) => {
        if (value === true) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    localStorage.setItem("favorites", JSON.stringify(cleanedFavorites));
  } catch (error) {
    console.error("Error cleaning up favorites:", error);
  }
};