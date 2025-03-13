import "../index.css";

import { useEffect, useState } from "react";
import { useProducts } from "../data/ProductsData";
import { Navbar } from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FooterMain from "../components/Footer";
import Granim from "granim";
import ImageCarousel from "../components/ImageCarousel";

function App() {
  // Use the hook to fetch products from Firebase
  const { products, loading, error } = useProducts();

  useEffect(() => {
    var granimInstance = new Granim({
      element: "#canvas-basic",
      direction: "left-right",
      isPausedWhenNotInView: false,
      states: {
        "default-state": {
          gradients: [
            ["#f1e967", "#95c672"],
            ["#eebbca", "#f1e967"],
          ],
          transitionSpeed: 1000,
        },
      },
    });

    return () => {
      granimInstance.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="hide-scrollbar">
        <section className="m-10">
          <ImageCarousel />
        </section>
        <section className="gradient-banner flex justify-center m-10 ">
          <div className="bg-pinegreen text-white flex flex-col rounded-xl gap-2 w-full items-end shadow-lg p-2">
            <canvas id="canvas-basic" className="rounded-xl w-full h-2">
              <div className="canvas-mask"></div>
            </canvas>
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
