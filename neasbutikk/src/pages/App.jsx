import "../index.css";
import { Navbar } from "../components/Navbar";
import FooterMain from "../components/Footer";
import ProductCard from "../components/ProductCard";

function App() {
  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="hide-scrollbar">
        <section className="product-cards flex-grow grid grid-cols-6 gap-4 m-10 hide-scrollbar">
          <ProductCard
            productName={"Laptop"}
            productDescription={
              "En perfekt laptop, for en perfekt mann, i en perfekt verden."
            }
            productPrice={"1999"}
            image={"/productImages/laptop.png"}
            altText={"Laptop"}
          />
          <ProductCard
            productName={"Laptop"}
            productDescription={
              "En perfekt laptop, for en perfekt mann, i en perfekt verden."
            }
            productPrice={"1999"}
            image={"/productImages/laptop.png"}
            altText={"Laptop"}
          />
          <ProductCard
            productName={"Laptop"}
            productDescription={
              "En perfekt laptop, for en perfekt mann, i en perfekt verden."
            }
            productPrice={"1999"}
            image={"/productImages/laptop.png"}
            altText={"Laptop"}
          />
          <ProductCard
            productName={"Laptop"}
            productDescription={
              "En perfekt laptop, for en perfekt mann, i en perfekt verden."
            }
            productPrice={"1999"}
            image={"/productImages/laptop.png"}
            altText={"Laptop"}
          />
          <ProductCard
            productName={"Laptop"}
            productDescription={
              "En perfekt laptop, for en perfekt mann, i en perfekt verden."
            }
            productPrice={"1999"}
            image={"/productImages/laptop.png"}
            altText={"Laptop"}
          />
          <ProductCard
            productName={"Laptop"}
            productDescription={
              "En perfekt laptop, for en perfekt mann, i en perfekt verden."
            }
            productPrice={"1999"}
            image={"/productImages/laptop.png"}
            altText={"Laptop"}
          />
        </section>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default App;
