import "../index.css";

import { useEffect } from "react";
import { products } from "../data/ProductsData";
import { Navbar } from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import FooterMain from "../components/Footer";
import Granim from "granim";

function App() {
  useEffect(() => {
    var granimInstance = new Granim({
      element: "#canvas-basic",
      direction: "left-right",
      isPausedWhenNotInView: true,
      states: {
        "default-state": {
          gradients: [
            ["#ff9966", "#ff5e62"],
            ["#00F260", "#0575E6"],
            ["#e1eec3", "#f05053"],
          ],
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
        <section className="welcome-banner flex justify-center m-10 ">
          <div className="bg-pinegreen text-white flex flex-col rounded-xl gap-2 w-full items-end shadow-lg p-2">
            <canvas id="canvas-basic" className="rounded-xl">
              <div className="canvas-mask"></div>
            </canvas>
          </div>
        </section>
        <div className="text-2xl text-pinegreen font-mabry m-10 flex justify-center">
          <h1>Populært siste uken</h1>
        </div>
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
