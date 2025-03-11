import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";

function Navbar() {
  return (
    <div className="bg-white text-black flex items-center rounded-2xl w-full shadow-lg h-25 px-6 mb-1">
      <a href="/">
        <img
          src="/neas.svg"
          alt="Logo"
          className="h-auto w-25 hover:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
        />
      </a>
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <SearchBar />
      </div>
      <div className="flex items-center ml-auto">
        <div className="mr-5">
          <BarIcon icon={<FaShoppingCart size={28} />} />
        </div>
        <div className="mr-1">
          <a href="https://minside.neas.no/register">
            <NavbarButton
              text={"Bli kunde ->"}
              bg={"bg-mossgreen"}
              textcolor={"text-pinegreen"}
              bghover={"hover:bg-mossgreen/85"}
            />
          </a>
        </div>
        <div className="ml-3.5">
          <a href="https://minside.neas.no/">
            <NavbarButton
              text={"Min side ->"}
              bg={"bg-pinegreen"}
              textcolor={"text-white"}
              texthover={"hover:text-sunlightyellow"}
              bghover={"hover:bg-pinegreen/85"}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form className="w-full max-w-md font-mabrylight" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="search"
          name="search"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hva leter du etter?"
          maxLength={36}
          className="w-full rounded-full bg-white px-3 py-2 pr-8 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-green-950 sm:text-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:scale-90 transition-all duration-150 ease-in-out cursor-pointer"
        >
          <BarIcon icon={<FaSearch size={20} />} text="Søk" />
        </button>
      </div>
    </form>
  );
}

function BarIcon({ icon }) {
  return (
    <div className="navbar-icon group relative hover:scale-90 transition-all duration-200 ease-in-out cursor-pointer">
      {icon}
    </div>
  );
}

function NavbarButton({ text, bg, textcolor, texthover, bghover }) {
  return (
    <div>
      <button
        className={`hover:scale-95 transition-all duration-200 ease-in-out cursor-pointer font-mabry text-xl rounded-full px-7 py-3 w-full ${bg} ${textcolor} ${texthover} ${bghover}`}
      >
        {text}
      </button>
    </div>
  );
}

export { Navbar, NavbarButton };
