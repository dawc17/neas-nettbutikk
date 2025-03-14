import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
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

function Divider() {
  return (
    <div className="flex justify-center w-full">
      <div className="divider bg-pinegreen h-0.5 mx-2 md:mx-5 w-full transition-all duration-200 ease-in-out group-hover:w-1/2 group-hover:bg-mossgreen"></div>
    </div>
  );
}

function ProductCard({
  productName,
  productDescription,
  price,
  image,
  altText,
  images = [],
  extendedDescription,
  id,
  onFavoriteChange,
}) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() =>
    getFavoriteFromStorage(id)
  );

  useEffect(() => {
    cleanupFavorites();
  }, []);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    if (!id) {
      console.warn("Product ID is missing!");
      return;
    }

    setIsFavorite((prev) => {
      const newValue = !prev;
      console.log("Setting favorite to:", newValue);
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
        console.log("Current favorites:", favorites);
        favorites[id] = newValue;
        localStorage.setItem("favorites", JSON.stringify(favorites));
        console.log("Updated favorites:", favorites);

        if (onFavoriteChange) {
          onFavoriteChange();
        }
      } catch (error) {
        console.error("Error saving favorite to localStorage:", error);
      }
      return newValue;
    });
  };

  const allImages = image
    ? [{ src: image, alt: altText }, ...images]
    : [...images];

  return (
    <>
      <div className="product-card bg-lightgray flex flex-col items-center p-3 md:p-4 rounded-lg md:rounded-xl gap-2 md:gap-5 group hover:scale-102 h-full min-h-[24rem] sm:h-[28rem] md:h-[32rem] w-full shadow-md hover:shadow-lg transition-all duration-200">
        <div className="w-full h-32 sm:h-36 md:h-40 flex items-center justify-center relative">
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 z-10 transition-all duration-200 hover:scale-110 bg-white/80 rounded-full hover:bg-white"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-xl mt-0.5" />
            ) : (
              <FaRegHeart className="text-pinegreen text-xl hover:text-red-500 mt-0.5" />
            )}
          </button>
          <img
            src={image}
            alt={altText}
            className="w-auto max-w-full h-full max-h-full object-contain mt-2 md:mt-5 scale-100 group-hover:scale-110 transition-all duration-200 ease-in-out"
          />
        </div>
        <Divider />
        <h3 className="font-mabry text-pinegreen text-base md:text-md h-12 md:h-14 line-clamp-2 text-center w-full px-1 md:px-2">
          {productName}
        </h3>
        <p className="font-mabrylight text-pinegreen text-sm md:text-md h-16 md:h-20 line-clamp-3 text-center w-full px-1 md:px-2">
          {productDescription}
        </p>
        <p className="font-mabry text-pinegreen text-base md:text-lg mt-1 md:mt-2">
          {price} NOK
        </p>
        <button
          onClick={() => setIsOverlayOpen(true)}
          className="bg-mossgreen text-pinegreen font-mabrylight rounded-lg md:rounded-xl px-2 py-1 w-full cursor-pointer scale-100 hover:scale-95 hover:bg-pinegreen hover:text-sunlightyellow transition-all duration-150 mt-auto text-sm md:text-base"
        >
          Les mer
        </button>
      </div>

      {isOverlayOpen && (
        <ProductOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
          productName={productName}
          productDescription={productDescription}
          extendedDescription={extendedDescription}
          price={price}
          allImages={allImages}
          id={id}
        />
      )}
    </>
  );
}

export default ProductCard;
