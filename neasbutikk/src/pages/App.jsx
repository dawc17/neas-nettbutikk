import "../index.css";
import { useProducts } from "../data/ProductsData";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FooterMain from "../components/Footer";
import ImageCarousel from "../components/ImageCarousel";

function App() {
  // Use the hook to fetch products from Firebase
  const { products, loading, error } = useProducts();

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
            <button className="category-btn bg-white hover:bg-gray-100 text-pinegreen font-medium py-4 px-6 rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col items-center w-36 h-36">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobil og nettbrett
            </button>
            <button className="category-btn bg-white hover:bg-gray-100 text-pinegreen font-medium py-4 px-6 rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col items-center w-36 h-36">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              PC og tilbehør
            </button>
            <button className="category-btn bg-white hover:bg-gray-100 text-pinegreen font-medium py-4 px-6 rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col items-center w-36 h-36">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              TV, lyd, og smarthus
            </button>
            <button className="category-btn bg-white hover:bg-gray-100 text-pinegreen font-medium py-4 px-6 rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col items-center w-36 h-36">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
              Gaming
            </button>
            <button className="category-btn bg-white hover:bg-gray-100 text-pinegreen font-medium py-4 px-6 rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col items-center w-36 h-36">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Kjøkken
            </button>
          </div>
        </section>
        
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
          ) : products && products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              Ingen produkter funnet
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

export default App;
