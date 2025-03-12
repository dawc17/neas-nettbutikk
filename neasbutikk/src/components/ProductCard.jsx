import { useState, useEffect } from "react";

function Divider() {
  return (
    <div className="divider bg-pinegreen h-0.5 mx-2 md:m-5 w-full transition-all duration-200 ease-in-out group-hover:w-1/2 group-hover:bg-mossgreen"></div>
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
}) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = image
    ? [{ src: image, alt: altText }, ...images]
    : [...images];

  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOverlayOpen]);

  useEffect(() => {
    if (!isOverlayOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOverlayOpen]);

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

  return (
    <>
      <div className="product-card bg-lightgray flex flex-col items-center p-3 md:p-4 rounded-lg md:rounded-xl gap-2 md:gap-5 group h-full min-h-[24rem] sm:h-[28rem] md:h-[32rem] w-full shadow-md hover:shadow-lg transition-all duration-200">
        <div className="w-full h-32 sm:h-36 md:h-40 flex items-center justify-center overflow-hidden">
          <img
            src={image}
            alt={altText}
            className="w-auto max-w-full h-auto max-h-full object-contain mt-2 md:mt-5 scale-100 group-hover:scale-110 transition-all duration-200 ease-in-out"
          />
        </div>
        <Divider />
        <h3 className="font-mabry text-pinegreen text-base md:text-lg h-12 md:h-14 line-clamp-2 text-center w-full px-1 md:px-2">
          {productName}
        </h3>
        <p className="font-mabrylight text-pinegreen text-sm md:text-base h-16 md:h-20 line-clamp-3 text-center w-full px-1 md:px-2">
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

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 transition-all duration-500 ease-in-out ${
          isOverlayOpen
            ? "backdrop-blur-md bg-white/30 opacity-100 visible"
            : "backdrop-blur-none bg-white/0 opacity-0 invisible"
        }`}
      >
        <div className="bg-lightgray rounded-lg md:rounded-xl w-full h-full md:w-11/12 md:h-5/6 lg:max-w-4xl relative shadow-2xl flex flex-col overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6 flex justify-between items-center border-b border-pinegreen/20">
            <h2 className="font-mabry text-pinegreen text-lg sm:text-xl md:text-2xl truncate pr-2">
              {productName}
            </h2>
            <button
              onClick={() => setIsOverlayOpen(false)}
              className="text-pinegreen hover:text-mossgreen text-lg md:text-xl p-1 md:p-2"
            >
              ✕
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-3 sm:p-4 md:p-6 pb-20 md:pb-24">
            <div className="relative flex justify-center mb-4 md:mb-6">
              <div className="w-full sm:w-3/4 md:w-2/3 relative">
                {allImages.length > 0 && (
                  <div className="aspect-w-1 aspect-h-1 relative">
                    <img
                      src={allImages[currentImageIndex]?.src}
                      alt={
                        allImages[currentImageIndex]?.alt ||
                        `Product image ${currentImageIndex + 1}`
                      }
                      className="w-full h-auto object-contain transition-opacity duration-300"
                    />

                    {allImages.length > 1 && (
                      <>
                        {/* Left arrow */}
                        <button
                          onClick={prevImage}
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-pinegreen rounded-r-lg p-1 md:p-2 z-10 shadow-md"
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

                        {/* Right arrow */}
                        <button
                          onClick={nextImage}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-pinegreen rounded-l-lg p-1 md:p-2 z-10 shadow-md"
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

            {/* Thumbnail indicators */}
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
              <div className="font-mabrylight text-pinegreen text-sm md:text-base whitespace-pre-line">
                {productDescription}
                <p className="mt-3 md:mt-5">{extendedDescription}</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-lightgray py-3 md:py-4 px-3 sm:px-4 md:px-6 border-t border-pinegreen/20 shadow-lg">
            <div className="flex justify-between items-center">
              <p className="font-mabry text-pinegreen text-lg sm:text-xl md:text-2xl">
                {price} NOK
              </p>
              <button className="bg-mossgreen text-pinegreen font-mabry rounded-lg md:rounded-xl px-3 py-1 sm:px-4 sm:py-2 text-sm md:text-base cursor-pointer hover:bg-pinegreen hover:text-sunlightyellow hover:scale-90 transition-all duration-150">
                Kjøp nå
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
