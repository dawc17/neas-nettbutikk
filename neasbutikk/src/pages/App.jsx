import "../index.css";

import { products } from "../data/ProductsData";
import { Navbar } from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FooterMain from "../components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="hide-scrollbar">
        <section className="product-cards flex-grow grid grid-cols-5 gap-4 m-10 hide-scrollbar">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </section>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default App;
