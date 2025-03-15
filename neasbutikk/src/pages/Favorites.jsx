import { useState, useEffect } from "react";
import { useProducts } from "../data/ProductsData";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FooterMain from "../components/Footer";

function Favorites() {
  const { products, loading, error } = useProducts();
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const updateFavorites = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
      const favoritedProducts = products.filter(
        (product) => favorites[product.id]
      );
      setFavoriteProducts(favoritedProducts);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Listen for storage events
  useEffect(() => {
    window.addEventListener("storage", updateFavorites);
    return () => window.removeEventListener("storage", updateFavorites);
  }, []);

  // Update favorites when products load or change
  useEffect(() => {
    if (!loading && !error && products.length > 0) {
      updateFavorites();
    }
  }, [products, loading, error]);

  // Create a custom onUnfavorite handler
  const handleUnfavorite = () => {
    updateFavorites();
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="hide-scrollbar">
        <div className="text-2xl text-pinegreen font-mabry m-10 flex justify-center">
          <h1>Mine favoritter</h1>
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
          ) : favoriteProducts.length > 0 ? (
            favoriteProducts.map((product, index) => (
              <ProductCard
                key={index}
                {...product}
                onFavoriteChange={handleUnfavorite} // Add this prop
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 font-mabrylight">
              Du har ingen favoritter enda.
              <br />
              <a href="/" className="text-mossgreen hover:underline">
                Gå til butikken
              </a>
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

export default Favorites;
