import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { formatPrice } from "../utils/priceFormatter";
import { useProducts } from "../data/ProductsData";

function FavoritesOverlay({ isVisible, onClose }) {
  const { products } = useProducts();
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  // Get favorite products whenever products load or favorites change
  useEffect(() => {
    if (!products?.length) return;

    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
      const favoritedProducts = products.filter(
        (product) => favorites[product.id]
      );
      setFavoriteProducts(favoritedProducts);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavoriteProducts([]);
    }
  }, [products, isVisible]); // Re-check when overlay becomes visible

  // Listen for storage events (in case favorites are modified in another tab/component)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "favorites" && products?.length) {
        try {
          const favorites = JSON.parse(e.newValue || "{}");
          const favoritedProducts = products.filter(
            (product) => favorites[product.id]
          );
          setFavoriteProducts(favoritedProducts);
        } catch (error) {
          console.error("Error processing storage event:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [products]);

  if (!isVisible) return null;

  return (
    <div
      className={`absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 transition-all duration-200 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      onMouseLeave={onClose}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-mabry text-pinegreen text-lg">Dine favoritter</h3>
          <span className="font-mabrylight text-pinegreen">
            {favoriteProducts.length}{" "}
            {favoriteProducts.length === 1 ? "produkt" : "produkter"}
          </span>
        </div>
      </div>

      {favoriteProducts.length > 0 ? (
        <>
          <div className="max-h-64 overflow-y-auto hide-scrollbar">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="p-3 border-b border-gray-100 flex items-center gap-3"
              >
                <div className="w-14 h-14 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-mabrylight text-pinegreen text-sm line-clamp-1">
                    {product.productName}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 line-clamp-1">
                      {product.productDescription.substring(0, 30)}
                      {product.productDescription.length > 30 ? "..." : ""}
                    </span>
                    <span className="font-mabry text-pinegreen text-sm">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <Link
              to="/favorites"
              className="bg-mossgreen text-pinegreen font-mabry rounded-lg w-full py-2 text-center block hover:bg-pinegreen hover:text-sunlightyellow transition-all duration-200"
            >
              Se alle favoritter
            </Link>
          </div>
        </>
      ) : (
        <div className="p-6 text-center rounded-b-xl">
          <FaHeart size={24} className="text-gray-300 mx-auto mb-2" />
          <p className="font-mabrylight text-pinegreen mb-2">
            Du har ingen favoritter enda
          </p>
          <Link to="/" className="text-mossgreen text-sm hover:underline">
            Utforsk produkter
          </Link>
        </div>
      )}
    </div>
  );
}

export default FavoritesOverlay;
