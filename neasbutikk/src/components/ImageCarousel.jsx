import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const rotatingImages = [
  {
    url: "/promotionalImages/simga1.jpg",
    alt: "Promotional banner 1",
    title: "Velkommen til NEAS nettbutikk",
  },
  {
    url: "/promotionalImages/simga2.png",
    alt: "Promotional banner 2",
    title: "Finn dine favoritter",
  },
  {
    url: "/promotionalImages/simga3.jpg",
    alt: "Promotional banner 3",
    title: "Alltid gode tilbud",
  },
];

const staticImage = {
  url: "/promotionalImages/simga1.jpg", // You can change this to a different static image
  alt: "Static promotional banner",
  title: "Spesialtilbud",
};

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === rotatingImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === rotatingImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? rotatingImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex gap-4 w-full">
      {/* Rotating Carousel Section */}
      <div className="relative w-2/3 h-[400px] overflow-hidden rounded-xl">
        {rotatingImages.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-all duration-500 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
              <div className="absolute bottom-8 left-8">
                <h2 className="text-white text-3xl font-mabry">{image.title}</h2>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all duration-200"
        >
          <FaChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all duration-200"
        >
          <FaChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {rotatingImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Static Image Section */}
      <div className="relative w-1/3 h-[400px] overflow-hidden rounded-xl">
        <img
          src={staticImage.url}
          alt={staticImage.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
          <div className="absolute bottom-8 left-8">
            <h2 className="text-white text-3xl font-mabry">{staticImage.title}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
