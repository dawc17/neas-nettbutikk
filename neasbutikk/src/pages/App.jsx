import "../index.css";
import { useState } from "react";
import { useProducts } from "../data/ProductsData";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ImageCarousel from "../components/ImageCarousel";
import {
  CATEGORY_NAMES,
  PRODUCT_CATEGORIES,
} from "../components/AdminProductForm";
import { Link } from "react-router-dom";

function App() {
  // Use the hook to fetch products from Firebase
  const { products, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState(null);

  // Filter products based on selected category
  const filteredProducts = activeCategory
    ? products.filter((product) => product.category === activeCategory)
    : products;

  const handleCategoryClick = (category) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="hide-scrollbar">
        <section className="m-10">
          <ImageCarousel />
        </section>

        {/* Category Buttons Section */}
        <section className="mx-10 my-12">
          <div className="flex flex-wrap justify-center gap-4">
            {/* All Products Button */}
            <button
              onClick={() => setActiveCategory(null)}
              className={`category-btn border-1 border-mossgreen py-4 px-6 rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col items-center w-36 h-36
                ${activeCategory === null ? "bg-mossgreen text-pinegreen font-bold" : "bg-white hover:bg-gray-100 text-pinegreen font-medium"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              <span>Alle produkter</span>
            </button>

            {/* Map through categories to create buttons */}
            {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
              <div
                key={value}
                className={`category-btn border-1 border-mossgreen py-4 px-6 rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col items-center w-36 h-36 cursor-pointer
                  ${activeCategory === value ? "bg-mossgreen text-pinegreen font-bold" : "bg-white hover:bg-gray-100 text-pinegreen font-medium"}`}
              >
                <div
                  className="flex flex-col items-center flex-grow"
                  onClick={() => handleCategoryClick(value)}
                >
                  {getCategoryIcon(value)}
                  <span>{CATEGORY_NAMES[value]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category title when filtering */}
        {activeCategory && (
          <div className="mx-10 mb-4">
            <h2 className="text-xl font-mabry text-pinegreen">
              {CATEGORY_NAMES[activeCategory]}
              <Link
                to={`/category/${activeCategory}`}
                className="ml-3 text-sm text-mossgreen hover:underline"
              >
                Vis alle produkter →
              </Link>
            </h2>
          </div>
        )}

        <div className="text-2xl text-pinegreen font-mabry m-10 flex justify-center">
          <h1>Populært denne uken</h1>
        </div>
        <section className="product-cards flex-grow grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 m-10 hide-scrollbar">
          {loading ? (
            <div className="col-span-full text-center py-10">
              Laster produkter...
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-10 text-red-500">
              Feil ved lasting av produkter: {error}
            </div>
          ) : filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              {activeCategory
                ? "Ingen produkter funnet i denne kategorien"
                : "Ingen produkter funnet"}
            </div>
          )}
        </section>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

// Helper function for category icons
function getCategoryIcon(category) {
  switch (category) {
    case PRODUCT_CATEGORIES.MOBIL:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      );
    case PRODUCT_CATEGORIES.PCTILBEHOR:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case PRODUCT_CATEGORIES.TV:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case PRODUCT_CATEGORIES.GAMING:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      );
    case PRODUCT_CATEGORIES.KITCHEN:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      );
  }
}

export default App;
