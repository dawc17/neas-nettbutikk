import { useSearchParams } from "react-router-dom";
import { useProducts } from "../data/ProductsData";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FooterMain from "../components/Footer";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const { products, loading, error } = useProducts();

  const filteredProducts =
    loading || error
      ? []
      : products.filter((product) =>
          product.productName.toLowerCase().includes(query)
        );

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 p-8">
        <h1 className="font-mabry text-2xl text-pinegreen mb-4">
          Søkeresultater for "{query}"
        </h1>

        {loading ? (
          <p className="font-mabrylight text-pinegreen">Laster produkter...</p>
        ) : error ? (
          <p className="font-mabrylight text-red-500">
            Feil ved lasting av produkter: {error}
          </p>
        ) : filteredProducts.length > 0 ? (
          <div className="product-cards grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        ) : (
          <p className="font-mabrylight text-pinegreen">
            Ingen produkter funnet for dette søket.
          </p>
        )}
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default SearchResults;
