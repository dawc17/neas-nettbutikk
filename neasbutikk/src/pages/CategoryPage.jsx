import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../data/ProductsData";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import ProductCard from "../components/ProductCard";
import {
  CATEGORY_NAMES,
  PRODUCT_CATEGORIES,
} from "../components/AdminProductForm";
// Import only the specific icons we need
import { FaArrowLeft, FaFilter, FaTimes, FaCheck } from "react-icons/fa";
import { formatPrice } from "../utils/priceFormatter";

function CategoryPage() {
  const { categoryId } = useParams();
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(false);
  const [selectedGBFilter, setSelectedGBFilter] = useState("all"); // New state for GB filter

  // Function to extract GB information from product name or description
  const extractGBFromProduct = (product) => {
    // Common formats: "128GB", "128 GB", "128 gb", etc.
    const gbRegex = /(\d+)\s*(?:gb|GB)/i;

    // First check product name
    const nameMatch = product.productName.match(gbRegex);
    if (nameMatch) return nameMatch[1];

    // Then check product description
    const descMatch = product.productDescription.match(gbRegex);
    if (descMatch) return descMatch[1];

    // Finally check product ID (if it contains GB info)
    const idMatch = product.id && product.id.match(gbRegex);
    if (idMatch) return idMatch[1];

    return null; // No GB information found
  };

  // Available GB options for mobile products
  const getAvailableGBOptions = () => {
    if (!products || loading || categoryId !== PRODUCT_CATEGORIES.MOBIL)
      return [];

    const gbValues = new Set();

    products
      .filter((product) => product.category === categoryId)
      .forEach((product) => {
        const gbValue = extractGBFromProduct(product);
        if (gbValue) gbValues.add(gbValue);
      });

    return Array.from(gbValues).sort((a, b) => parseInt(a) - parseInt(b));
  };

  useEffect(() => {
    if (loading || error || !products.length) return;

    let filtered = products;

    // Filter by category
    if (categoryId) {
      filtered = filtered.filter((product) => product.category === categoryId);
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by GB for mobile products
    if (categoryId === PRODUCT_CATEGORIES.MOBIL && selectedGBFilter !== "all") {
      filtered = filtered.filter((product) => {
        const productGB = extractGBFromProduct(product);
        return productGB === selectedGBFilter;
      });
    }

    // Sort products
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case "newest":
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "featured":
      default:
        break;
    }

    setFilteredProducts(filtered);

    // Check if any filter is active
    const maxProductPrice = Math.max(...products.map((p) => p.price));
    const isFilterActive =
      priceRange[0] > 0 ||
      priceRange[1] < maxProductPrice ||
      sortOption !== "featured";

    setActiveFilters(isFilterActive);
  }, [
    categoryId,
    products,
    loading,
    error,
    sortOption,
    priceRange,
    selectedGBFilter,
  ]);

  const maxPrice =
    loading || !products.length
      ? 10000
      : Math.max(...products.map((p) => p.price)) + 1000;

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);

    // Make sure min is not greater than max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0];
    }

    setPriceRange(newRange);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const resetFilters = () => {
    setPriceRange([0, maxPrice]);
    setSortOption("featured");
    setSelectedGBFilter("all"); // Reset GB filter as well
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 p-4 md:p-10 hide-scrollbar">
        <div className="mb-6">
          <Link to="/" className="text-secondary hover:underline">
            Hjem
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="font-mabry text-primary">
            {CATEGORY_NAMES[categoryId] || "Kategori"}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <button
            onClick={toggleMobileFilters}
            className="md:hidden flex items-center justify-center py-2 px-4 bg-secondary text-primary rounded-lg shadow-sm mb-4"
          >
            <FaFilter className="mr-2" />
            {showMobileFilters ? "Skjul filtre" : "Vis filtre"}
          </button>

          <div
            className={`${
              showMobileFilters ? "block" : "hidden"
            } md:block md:w-1/4 lg:w-1/5 bg-neutral p-4 rounded-lg shadow-md`}
          >
            <div className="flex justify-between items-center md:hidden mb-2">
              <h2 className="font-mabry text-lg text-primary">Filtre</h2>
              <button
                onClick={toggleMobileFilters}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="font-mabry text-lg text-primary md:block mb-4">
                Filtre
              </h2>
              {activeFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-primary hover:underline flex items-center"
                >
                  Nullstill filtre
                </button>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-mabry text-primary mb-2">Pris</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-mabrylight text-sm text-primary">
                    {formatPrice(priceRange[0])}
                  </span>
                  <span className="font-mabrylight text-sm text-primary">
                    {formatPrice(priceRange[1])}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                  className="w-full accent-secondary"
                />

                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                  className="w-full accent-secondary"
                />

                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full px-2 py-1 border border-base-300 rounded-md text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full px-2 py-1 border border-base-300 rounded-md text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* GB filter for mobile products */}
            {categoryId === PRODUCT_CATEGORIES.MOBIL && (
              <div className="mb-6 mt-4">
                <h3 className="font-mabry text-primary mb-2">Lagringsplass</h3>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="gb-all"
                      name="gb-filter"
                      value="all"
                      checked={selectedGBFilter === "all"}
                      onChange={() => setSelectedGBFilter("all")}
                      className="mr-2 accent-secondary"
                    />
                    <label
                      htmlFor="gb-all"
                      className="font-mabrylight text-primary cursor-pointer"
                    >
                      Alle størrelser
                    </label>
                  </div>

                  {getAvailableGBOptions().map((gb) => (
                    <div key={gb} className="flex items-center">
                      <input
                        type="radio"
                        id={`gb-${gb}`}
                        name="gb-filter"
                        value={gb}
                        checked={selectedGBFilter === gb}
                        onChange={() => setSelectedGBFilter(gb)}
                        className="mr-2 accent-secondary"
                      />
                      <label
                        htmlFor={`gb-${gb}`}
                        className="font-mabrylight text-primary cursor-pointer"
                      >
                        {gb} GB
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-mabry text-primary mb-2">Sorter etter</h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 border border-base-300 rounded-md bg-base-200"
              >
                <option value="featured">Anbefalte</option>
                <option value="price-asc">Pris (lav til høy)</option>
                <option value="price-desc">Pris (høy til lav)</option>
                <option value="name-asc">Navn (A til Å)</option>
                <option value="name-desc">Navn (Å til A)</option>
                <option value="newest">Nyeste først</option>
              </select>
            </div>
          </div>

          <div className="md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-mabry text-primary">
                {CATEGORY_NAMES[categoryId] || "Alle produkter"}
              </h1>

              {activeFilters && (
                <div className="hidden md:flex items-center text-sm text-primary font-mabrylight">
                  <FaCheck className="text-secondary mr-1" />
                  <span>Filtre aktive</span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">Laster produkter...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                Feil ved lasting av produkter
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id || index} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 font-mabrylight text-primary">
                Ingen produkter funnet med disse filtrene.
                <p className="mt-4">
                  <button
                    onClick={resetFilters}
                    className="text-secondary hover:underline"
                  >
                    Nullstill filtre
                  </button>
                  <span className="mx-2">eller</span>
                  <Link to="/" className="text-secondary hover:underline">
                    Tilbake til butikken
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default CategoryPage;
