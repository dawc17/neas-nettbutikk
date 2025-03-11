import { useSearchParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import FooterMain from "../components/Footer";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 p-8">
        <h1 className="font-mabry text-2xl text-pinegreen mb-4">
          Søkeresultater for "{query}"
        </h1>
        {/* Add your search results grid here */}
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default SearchResults;
