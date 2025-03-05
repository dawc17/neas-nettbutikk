import "./index.css";
import { Navbar } from "./components/Navbar";
import FooterMain from "./components/Footer";

function App() {
  return (
    <>
      <header className="min-h-screen flex flex-col">
        <Navbar />
      </header>
      <main className="flex-1 flex items-start"></main>
      <footer>
        <FooterMain />
      </footer>
    </>
  );
}

export default App;
