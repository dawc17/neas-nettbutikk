import "../index.css";
import { useState, useEffect, useRef } from "react";
import { useProducts } from "../data/ProductsData";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ImageCarousel from "../components/ImageCarousel";
import {
  CATEGORY_NAMES,
  PRODUCT_CATEGORIES,
} from "../components/AdminProductForm";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
// Import icons from react-icons
import { FaMobileAlt } from "react-icons/fa";
import { FaGamepad, FaTv, FaComputer } from "react-icons/fa6";
import { MdKitchen } from "react-icons/md";

function App() {
  // Use the hook to fetch products from Firebase!!!
  const { products, loading, error } = useProducts();
  const [productViews, setProductViews] = useState({});
  const [productOrders, setProductOrders] = useState({});
  const [loadingViews, setLoadingViews] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [popularProducts, setPopularProducts] = useState([]);
  const popularProductsRef = useRef(null);
  const navigate = useNavigate();

  // Fetch product views data
  useEffect(() => {
    const database = getDatabase();
    const viewsRef = ref(database, "productViews");

    const unsubscribe = onValue(
      viewsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const viewsData = snapshot.val();
          setProductViews(viewsData);
        }
        setLoadingViews(false);
      },
      (error) => {
        console.error("Error fetching product views:", error);
        setLoadingViews(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch product orders data
  useEffect(() => {
    const database = getDatabase();
    const ordersRef = ref(database, "productOrders");

    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          setProductOrders(ordersData);
        }
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Error fetching product orders:", error);
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Calculate popular products based on combined weekly views and orders
  useEffect(() => {
    if (loading || loadingViews || loadingOrders || !products.length) return;

    // Create an array of products with their popularity scores
    const productsWithPopularity = products.map((product) => {
      const viewData = productViews[product.id];
      const orderData = productOrders[product.id];

      const weeklyViews = viewData?.weekly?.count || 0;
      const weeklyOrders = orderData?.weekly?.count || 0;

      // Calculate popularity score: 1 × weekly views + 5 × weekly orders
      const popularityScore = weeklyViews + 5 * weeklyOrders;

      return {
        ...product,
        weeklyViews,
        weeklyOrders,
        popularityScore,
      };
    });

    // Sort by popularity score and take top 5
    const sorted = [...productsWithPopularity]
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 5);

    setPopularProducts(sorted);
  }, [
    products,
    productViews,
    productOrders,
    loading,
    loadingViews,
    loadingOrders,
  ]);

  // Animation effect for popular products
  useEffect(() => {
    if (!loading && !loadingViews && !loadingOrders && popularProducts.length > 0 && popularProductsRef.current) {
      // Get all product card elements
      const productItems = popularProductsRef.current.querySelectorAll('.popular-product-item');
      
      // Reset animations - remove any existing animation classes
      productItems.forEach(item => {
        item.classList.remove('animate');
      });
      
      // Force a reflow to ensure animations restart properly
      void popularProductsRef.current.offsetWidth;
      
      // Apply animations with staggered delays
      productItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animate');
        }, index * 100); // Slightly longer delay (100ms) for a more dramatic effect
      });
    }
  }, [popularProducts, loading, loadingViews, loadingOrders]);

  // Navigate to category page
  const navigateToCategory = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <meta property="og:type" content="website"></meta>
      <meta property="og:url" content="https://neas-sigma.web.app"></meta>
      <meta property="og:title" content="NEAS Nettbutikk"></meta>
      <meta
        property="og:description"
        content="Velkommen til NEAS Nettbutikk! Her finner du et bredt utvalg av produkter og tjenester som tilbys av NEAS."
      ></meta>
      <meta
        property="og:image"
        content="https://images2.imgbox.com/4e/92/mhGqLPIM_o.png"
      ></meta>
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
            {/* Map through categories to create buttons */}
            {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
              <button
                key={value}
                onClick={() => navigateToCategory(value)}
                className="category-btn border-1 font-mabry border-secondary py-4 px-6 rounded-lg shadow-md transition-transform hover:scale-105 flex flex-col items-center justify-center w-36 h-36 text-center bg-neutral hover:bg-neutral/80 text-primary font-medium"
              >
                {getCategoryIcon(value)}
                <span className="w-full">{CATEGORY_NAMES[value]}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="text-2xl text-primary font-mabry m-10 flex justify-center">
          <h1>Populært denne uken</h1>
        </div>
        <section ref={popularProductsRef} className="product-cards flex-grow grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 m-10 hide-scrollbar">
          {loading || loadingViews || loadingOrders ? (
            <div className="col-span-full text-center py-10">
              Laster produkter...
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-10 text-red-500">
              Feil ved lasting av produkter: {error}
            </div>
          ) : popularProducts.length > 0 ? (
            popularProducts.map((product) => (
              <div key={product.id} className="popular-product-item search-result-item">
                <ProductCard {...product} />
              </div>
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

// Helper function for category icons - replaced with react-icons
function getCategoryIcon(category) {
  switch (category) {
    case PRODUCT_CATEGORIES.MOBIL:
      return <FaMobileAlt className="h-10 w-10 mb-2" />;
    case PRODUCT_CATEGORIES.PCTILBEHOR:
      return <FaComputer className="h-10 w-10 mb-2" />;
    case PRODUCT_CATEGORIES.TV:
      return <FaTv className="h-10 w-10 mb-2" />;
    case PRODUCT_CATEGORIES.GAMING:
      return <FaGamepad className="h-10 w-10 mb-2" />;
    case PRODUCT_CATEGORIES.KITCHEN:
      return <MdKitchen className="h-10 w-10 mb-2" />;
    default:
      return <MdKitchen className="h-10 w-10 mb-2" />;
  }
}

export default App;
