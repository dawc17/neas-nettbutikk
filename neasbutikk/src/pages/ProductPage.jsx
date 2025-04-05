import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../data/ProductsData";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Import Auth Context
import { formatPrice } from "../utils/priceFormatter";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { CATEGORY_NAMES } from "../components/AdminProductForm";
import ReviewSection from "../components/ReviewSection";
import { getDatabase, ref, onValue, set } from "firebase/database"; // Import Firebase functions

function ProductPage() {
  const { productId } = useParams();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { currentUser } = useAuth(); // Get current user
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Find the product with matching ID when products load
  useEffect(() => {
    if (!loading && products?.length > 0) {
      const foundProduct = products.find((p) => p.id === productId);
      setProduct(foundProduct);
    }
  }, [productId, products, loading]);

  // Check if product is favorited using Firebase
  useEffect(() => {
    if (!productId || !currentUser) {
      setIsFavorite(false);
      return;
    }

    const db = getDatabase();
    const userFavoritesRef = ref(
      db,
      `users/${currentUser.uid}/favorites/${productId}`
    );

    const unsubscribe = onValue(userFavoritesRef, (snapshot) => {
      setIsFavorite(!!snapshot.val());
    });

    return () => unsubscribe();
  }, [productId, currentUser]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        quantity,
      });
    }
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleQuantityInput = (e) => {
    const value = e.target.value;

    // Allow empty string for typing purposes
    if (value === "") {
      setQuantity("");
      return;
    }

    // Convert to number and validate
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setQuantity(Math.max(1, numValue));
    }
  };

  // Ensure quantity is a number when losing focus
  const handleQuantityBlur = () => {
    if (quantity === "" || isNaN(quantity)) {
      setQuantity(1);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!product) return;

    if (!currentUser) {
      alert("Du må være logget inn for å legge til favoritter.");
      return;
    }

    try {
      const db = getDatabase();
      const userFavoritesRef = ref(
        db,
        `users/${currentUser.uid}/favorites/${product.id}`
      );

      // Toggle favorite status
      const newFavoriteStatus = !isFavorite;
      await set(userFavoritesRef, newFavoriteStatus ? true : null); // Use null to remove from database
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  // Get all product images
  const allImages = product?.image
    ? [
        { src: product.image, alt: product.productName },
        ...(product.images || []),
      ]
    : product?.images || [];

  const nextImage = () => {
    if (!allImages.length) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!allImages.length) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow p-4 md:p-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="font-mabrylight text-primary">Laster produkt...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="font-mabrylight text-red-500">
              Feil ved lasting av produkt: {error}
            </p>
          </div>
        ) : !product ? (
          <div className="text-center py-12">
            <p className="font-mabrylight text-primary">
              Produkt ikke funnet
            </p>
            <Link
              to="/"
              className="text-secondary hover:underline mt-4 inline-block"
            >
              Tilbake til butikken
            </Link>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <nav
              className="flex mb-4 text-sm font-mabrylight"
              aria-label="Breadcrumb"
            >
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-secondary hover:text-primary">
                    Hjem
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <Link
                      to={`/category/${product.category}`}
                      className="text-secondary hover:text-primary"
                    >
                      {CATEGORY_NAMES[product.category] || "Kategori"}
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-primary truncate max-w-[200px]">
                      {product.productName}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Back button - you can keep or remove this now that you have breadcrumbs */}
            <Link
              to="/"
              className="inline-flex items-center font-mabrylight text-primary hover:text-secondary mb-6 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Tilbake til butikken
            </Link>

            <div className="bg-neutral rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                {/* Product images */}
                <div className="md:w-1/2 p-4 md:p-8">
                  <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                    {allImages.length > 0 && (
                      <>
                        <img
                          src={allImages[currentImageIndex]?.src}
                          alt={
                            allImages[currentImageIndex]?.alt ||
                            product.productName
                          }
                          className="w-full h-full object-contain"
                        />

                        {allImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-primary rounded-full p-2 shadow-md transition-all duration-200"
                              aria-label="Previous image"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 19l-7-7 7-7"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-primary rounded-full p-2 shadow-md transition-all duration-200"
                              aria-label="Next image"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {/* Thumbnail navigation */}
                  {allImages.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            currentImageIndex === index
                              ? "bg-primary scale-125"
                              : "bg-primary/40 hover:bg-primary/70"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Product info */}
                <div className="md:w-1/2 p-4 md:p-8">
                  <div className="flex justify-between items-start">
                    <h1 className="font-mabry text-2xl text-primary mb-2">
                      {product.productName}
                    </h1>
                    <button
                      onClick={handleFavoriteToggle}
                      className="p-2 transition-all duration-200 hover:scale-110 bg-white/90 rounded-full hover:bg-white"
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      {isFavorite ? (
                        <FaHeart className="text-red-500 text-xl" />
                      ) : (
                        <FaRegHeart className="text-primary text-xl hover:text-red-500" />
                      )}
                    </button>
                  </div>

                  <div className="font-mabry text-2xl text-primary my-4">
                    {formatPrice(product.price)}
                  </div>

                  <div className="font-mabrylight text-primary mb-6">
                    {product.productDescription}
                  </div>

                  {/* Add to cart section */}
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex items-center mb-4">
                      <span className="mr-4 font-mabry text-primary">
                        Antall:
                      </span>
                      <div className="flex items-center border border-primary/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="bg-gray-100 px-3 py-1 text-primary hover:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={quantity}
                          onChange={handleQuantityInput}
                          onBlur={handleQuantityBlur}
                          className="px-2 py-1 font-mabry text-primary w-16 text-center focus:outline-none"
                          aria-label="Quantity"
                        />
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="bg-gray-100 px-3 py-1 text-primary hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="bg-secondary text-primary font-mabry rounded-lg w-full py-3 cursor-pointer hover:bg-primary hover:text-secondary-content hover:scale-[0.98] transition-all duration-150"
                    >
                      Legg til handlekurv
                    </button>
                  </div>
                </div>
              </div>

              {/* Extended description */}
              {product.extendedDescription && (
                <div className="border-t border-primary/10 p-4 md:p-8">
                  <h2 className="font-mabry text-xl text-primary mb-4">
                    Produktdetaljer
                  </h2>
                  <div className="product-extended-description font-mabrylight">
                    <ReactMarkdown>{product.extendedDescription}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Review section */}
              <ReviewSection productId={productId} />
            </div>
          </div>
        )}
      </main>

      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default ProductPage;
