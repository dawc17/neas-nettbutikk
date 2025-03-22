import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/priceFormatter";
import ReactMarkdown from "react-markdown";

function ProductOverlay({
  isOpen,
  onClose,
  productName,
  productDescription,
  extendedDescription,
  price,
  allImages = [],
  id,
}) {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentImageIndex(0);
      setQuantity(1); 
      
    }
  }, [isOpen]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      quantity,
    });

    onClose();
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
    console.log({allImages})
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-2 transition-all duration-500 ease-in-out ${
        isOpen
          ? "backdrop-blur-md bg-white/30 opacity-100 visible"
          : "backdrop-blur-none bg-white/0 opacity-0 invisible"
      }`}
    >
      <div className="bg-lightgray rounded-lg md:rounded-xl w-full h-full md:w-11/12 md:h-11/12 lg:max-w-4xl relative shadow-2xl flex flex-col overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 flex justify-between items-center border-b border-pinegreen/20">
          <h2 className="font-mabry text-pinegreen text-lg sm:text-xl md:text-2xl truncate pr-2">
            {productName}
          </h2>
          <button
            onClick={onClose}
            className="text-pinegreen hover:text-mossgreen text-lg md:text-xl p-1 md:p-2"
          >
            ✕
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-3 sm:p-4 md:p-6 pb-20 md:pb-24 scrollbar-hide">
          <div className="relative flex justify-center mb-4 md:mb-6">
            <div className="w-full sm:w-3/4 md:w-2/3 relative">
              {allImages.length > 0 && (
                <div className="aspect-w-1 aspect-h-1 relative overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {allImages.map((img, index) => (
                      <img
                        key={index}
                        src={img.src}
                        alt={img.alt || `Product image ${index + 1}`}
                        className="w-full h-full object-contain flex-shrink-0"
                      />
                    ))}
                  </div>

                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-pinegreen rounded-r-lg p-1 md:p-2 z-10 shadow-md transition-all duration-200"
                        aria-label="Previous image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-6 md:w-6"
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
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-pinegreen rounded-l-lg p-1 md:p-2 z-10 shadow-md transition-all duration-200"
                        aria-label="Next image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 md:h-6 md:w-6"
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
                </div>
              )}
            </div>
          </div>

          {allImages.length > 1 && (
            <div className="flex justify-center gap-2 mb-4 md:mb-6">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
                    currentImageIndex === index
                      ? "bg-pinegreen scale-125"
                      : "bg-pinegreen/40 hover:bg-pinegreen/70"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div>
            <h3 className="font-mabry text-pinegreen text-lg md:text-xl mb-2">
              Beskrivelse
            </h3>
            <div className="font-mabrylight text-pinegreen text-sm md:text-base">
              {productDescription}
              
              {/* Markdown renderer for extended description */}
              <div className="mt-4 md:mt-6 product-extended-description">
                <ReactMarkdown >
                  {extendedDescription}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-lightgray py-3 md:py-4 px-3 sm:px-4 md:px-6 border-t border-pinegreen/20 shadow-lg">
          <div className="flex justify-between items-center">
            <p className="font-mabry text-pinegreen text-lg sm:text-xl md:text-2xl">
              {formatPrice(price)}
            </p>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center border border-pinegreen/30 rounded-lg overflow-hidden">
                <button
                  onClick={handleDecrement}
                  className="bg-gray-100 px-2 py-1 text-pinegreen hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-1 font-mabry text-pinegreen min-w-[30px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="bg-gray-100 px-2 py-1 text-pinegreen hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-mossgreen text-pinegreen font-mabry rounded-lg md:rounded-xl px-3 py-1 sm:px-4 sm:py-2 text-sm md:text-base cursor-pointer hover:bg-pinegreen hover:text-sunlightyellow hover:scale-95 transition-all duration-150"
                >
                  Legg til handlekurv
                </button>
                <Link
                  to={`/product/${id}`}
                  onClick={onClose}
                  className="border border-pinegreen text-pinegreen font-mabry rounded-lg md:rounded-xl px-3 py-1 sm:px-4 sm:py-2 text-sm md:text-base hover:bg-pinegreen hover:text-white hover:scale-95 transition-all duration-150 whitespace-nowrap"
                >
                  Se detaljer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductOverlay;