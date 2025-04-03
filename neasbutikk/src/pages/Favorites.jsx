import { useState, useEffect } from "react";
import { useProducts } from "../data/ProductsData";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, onValue } from "firebase/database";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FooterMain from "../components/Footer";
import { Link } from "react-router-dom";

function Favorites() {
  const { products, loading, error } = useProducts();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || !products?.length) return;
    
    const db = getDatabase();
    const userFavoritesRef = ref(db, `users/${currentUser.uid}/favorites`);
    
    const unsubscribe = onValue(userFavoritesRef, (snapshot) => {
      const favoritesData = snapshot.val() || {};
      const favoritedProducts = products.filter(product => 
        favoritesData[product.id]
      );
      setFavoriteProducts(favoritedProducts);
    });
    
    return () => unsubscribe();
  }, [currentUser, products]);

  const handleUnfavorite = () => {
    // The database listener will update the UI automatically
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col hide-scrollbar">
        <header>
          <Navbar />
        </header>
        <main className="flex flex-col items-center justify-center flex-grow p-10">
          <div className="text-center max-w-md">
            <h2 className="text-2xl text-pinegreen font-mabry mb-4">Logg inn for å se favoritter</h2>
            <p className="font-mabrylight mb-6">
              Du må være logget inn for å kunne lagre og se dine favoritter på tvers av enheter.
            </p>
            <Link to="/login" className="bg-mossgreen text-pinegreen font-mabry rounded-lg py-2 px-6 hover:bg-pinegreen hover:text-sunlightyellow transition-all duration-200">
              Logg inn
            </Link>
          </div>
        </main>
        <footer>
          <FooterMain />
        </footer>
      </div>
    );
  }

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
                onFavoriteChange={handleUnfavorite} 
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
