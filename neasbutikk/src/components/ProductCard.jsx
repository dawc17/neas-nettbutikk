import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import ProductOverlay from "./ProductOverlay";
import { formatPrice } from "../utils/priceFormatter";
import { getDatabase, ref, onValue, off, set } from "firebase/database";
import { useAuth } from "../context/AuthContext"; // Import Auth Context

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
  const [showOverlay, setShowOverlay] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewStats, setReviewStats] = useState({ count: 0, average: 0 });
  const { currentUser } = useAuth(); // Get current user

  useEffect(() => {
    if (!id || !currentUser) return;

    const db = getDatabase();
    const userFavoritesRef = ref(db, `users/${currentUser.uid}/favorites/${id}`);

    const unsubscribe = onValue(userFavoritesRef, (snapshot) => {
      setIsFavorite(!!snapshot.val());
    });

    return () => unsubscribe();
  }, [id, currentUser]);

  useEffect(() => {
    if (!id) return;

    const database = getDatabase();
    const reviewsRef = ref(database, `reviews/${id}`);

    onValue(reviewsRef, (snapshot) => {
      const reviews = snapshot.val();
      if (reviews) {
        const reviewsArr = Object.values(reviews);
        const count = reviewsArr.length;
        const totalRating = reviewsArr.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const average = totalRating / count;

        setReviewStats({ count, average });
      } else {
        setReviewStats({ count: 0, average: 0 });
      }
    });

    return () => {
      off(reviewsRef);
    };
  }, [id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!id) {
      console.warn("Product ID is missing!");
      return;
    }

    if (!currentUser) {
      alert("Du må være logget inn for å legge til favoritter."); // Alert user to log in
      return;
    }

    try {
      const db = getDatabase();
      const userFavoritesRef = ref(db, `users/${currentUser.uid}/favorites/${id}`);

      // Toggle favorite status
      const newFavoriteStatus = !isFavorite;
      await set(userFavoritesRef, newFavoriteStatus ? true : null); // Use null to remove from database

      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const allImages = image
    ? [{ src: image, alt: altText }, ...images]
    : [...images];

  return (
    <div className="product-card bg-lightgray border-1 border-mossgreen flex flex-col items-center p-3 md:p-4 rounded-lg md:rounded-xl gap-2 md:gap-5 group hover:scale-102 h-full min-h-[24rem] sm:h-[28rem] md:h-[32rem] w-full shadow-md hover:shadow-lg transition-all duration-200">
      <div className="w-full h-32 sm:h-36 md:h-40 flex items-center justify-center relative">
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 z-10 transition-all duration-200 hover:scale-110 bg-white/80 rounded-full hover:bg-white"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-xl mt-0.5" />
          ) : (
            <FaRegHeart className="text-pinegreen text-xl hover:text-red-500 mt-0.5" />
          )}
        </button>

        <Link
          to={`/product/${id}`}
          className="w-auto h-full flex items-center justify-center cursor-pointer"
        >
          <img
            src={image}
            alt={altText}
            className="w-auto max-w-full h-full max-h-full object-contain mt-2 md:mt-5 scale-100 group-hover:scale-110 transition-all duration-200 ease-in-out"
          />
        </Link>
      </div>
      <Divider />

      <Link
        to={`/product/${id}`}
        className="h-12 md:h-14 w-full px-1 md:px-2 hover:underline decoration-pinegreen/50"
      >
        <h3 className="font-mabry text-pinegreen text-base md:text-md line-clamp-2 text-center">
          {productName}
        </h3>
      </Link>

      {/* Updated product description with better responsive height */}
      <p className="font-mabrylight text-pinegreen text-sm md:text-md min-h-[4rem] h-auto max-h-24 line-clamp-3 sm:line-clamp-3 md:line-clamp-4 text-center w-full px-1 md:px-2 mb-auto">
        {productDescription}
      </p>

      <div className="flex items-center justify-center w-full mt-1">
        <div className="flex items-center">
          <div className="flex items-center text-yellow-500 mr-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`h-3 w-3 ${
                  i < Math.round(reviewStats.average)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          {reviewStats.count > 0 && (
            <span className="text-xs text-pinegreen">
              ({reviewStats.count})
            </span>
          )}
        </div>
      </div>

      <p className="font-mabry text-pinegreen text-base md:text-lg mt-1 md:mt-2">
        {formatPrice(price)}
      </p>
    </div>
  );
}

export default ProductCard;
