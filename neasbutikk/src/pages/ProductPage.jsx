import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../data/ProductsData";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/priceFormatter";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import { FaArrowLeft, FaHeart, FaRegHeart } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

function ProductPage() {
  const { productId } = useParams();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Find the product with matching ID when products load
  useEffect(() => {
    if (!loading && products?.length > 0) {
      const foundProduct = products.find((p) => p.id === productId);
      setProduct(foundProduct);
      
      // Check if product is favorited
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
        setIsFavorite(!!favorites[productId]);
      } catch (error) {
        console.error("Error loading favorite status:", error);
      }
    }
  }, [productId, products, loading]);

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

  const handleFavoriteToggle = () => {
    if (!product) return;
    
    try {
      const newValue = !isFavorite;
      setIsFavorite(newValue);
      
      const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
      favorites[product.id] = newValue;
      localStorage.setItem("favorites", JSON.stringify(favorites));
      
      // Dispatch an event to notify other components
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error saving favorite:", error);
    }
  };

  // Get all product images
  const allImages = product?.image 
    ? [{ src: product.image, alt: product.productName }, ...(product.images || [])]
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
            <p className="font-mabrylight text-pinegreen">Laster produkt...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="font-mabrylight text-red-500">
              Feil ved lasting av produkt: {error}
            </p>
          </div>
        ) : !product ? (
          <div className="text-center py-12">
            <p className="font-mabrylight text-pinegreen">Produkt ikke funnet</p>
            <Link to="/" className="text-mossgreen hover:underline mt-4 inline-block">
              Tilbake til butikken
            </Link>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Back button */}
            <Link
              to="/"
              className="inline-flex items-center font-mabrylight text-pinegreen hover:text-mossgreen mb-6 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Tilbake til butikken
            </Link>

            <div className="bg-lightgray rounded-xl shadow-md overflow-hidden">
              <div className="md:flex">
                {/* Product images */}
                <div className="md:w-1/2 p-4 md:p-8">
                  <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                    {allImages.length > 0 && (
                      <>
                        <img
                          src={allImages[currentImageIndex]?.src}
                          alt={allImages[currentImageIndex]?.alt || product.productName}
                          className="w-full h-full object-contain"
                        />
                        
                        {allImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-pinegreen rounded-full p-2 shadow-md transition-all duration-200"
                              aria-label="Previous image"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-pinegreen rounded-full p-2 shadow-md transition-all duration-200"
                              aria-label="Next image"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                              ? "bg-pinegreen scale-125"
                              : "bg-pinegreen/40 hover:bg-pinegreen/70"
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
                    <h1 className="font-mabry text-2xl text-pinegreen mb-2">
                      {product.productName}
                    </h1>
                    <button
                      onClick={handleFavoriteToggle}
                      className="p-2 transition-all duration-200 hover:scale-110 bg-white/90 rounded-full hover:bg-white"
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {isFavorite ? (
                        <FaHeart className="text-red-500 text-xl" />
                      ) : (
                        <FaRegHeart className="text-pinegreen text-xl hover:text-red-500" />
                      )}
                    </button>
                  </div>

                  <div className="font-mabry text-2xl text-pinegreen my-4">
                    {formatPrice(product.price)}
                  </div>

                  <div className="font-mabrylight text-pinegreen mb-6">
                    {product.productDescription}
                  </div>

                  {/* Add to cart section */}
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex items-center mb-4">
                      <span className="mr-4 font-mabry text-pinegreen">Antall:</span>
                      <div className="flex items-center border border-pinegreen/30 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(-1)}
                          className="bg-gray-100 px-3 py-1 text-pinegreen hover:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 font-mabry text-pinegreen min-w-[40px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(1)}
                          className="bg-gray-100 px-3 py-1 text-pinegreen hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="bg-mossgreen text-pinegreen font-mabry rounded-lg w-full py-3 cursor-pointer hover:bg-pinegreen hover:text-sunlightyellow hover:scale-[0.98] transition-all duration-150"
                    >
                      Legg til handlekurv
                    </button>
                  </div>
                </div>
              </div>

              {/* Extended description */}
              {product.extendedDescription && (
                <div className="border-t border-pinegreen/10 p-4 md:p-8">
                  <h2 className="font-mabry text-xl text-pinegreen mb-4">
                    Produktdetaljer
                  </h2>
                  <div className="product-extended-description font-mabrylight">
                    <ReactMarkdown>{product.extendedDescription}</ReactMarkdown>
                  </div>
                </div>
              )}
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