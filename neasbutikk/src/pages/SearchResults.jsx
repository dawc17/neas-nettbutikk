import { useSearchParams } from "react-router-dom";
import { products } from "../data/ProductsData";
import { Navbar } from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FooterMain from "../components/Footer";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase();

  const filteredProducts = products.filter((product) =>
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
        {filteredProducts.length > 0 ? (
          <div className="product-cards grid grid-cols-6 gap-4">
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
