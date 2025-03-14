import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount, showNotification } = useCart();
  const cartCount = getCartCount();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-white text-black flex flex-wrap items-center justify-between rounded-2xl w-full shadow-lg px-4 md:px-6 py-3 md:py-4 mb-1 relative">
      <a href="/" className="z-10">
        <img
          src="/neas.svg"
          alt="Logo"
          className="h-auto w-16 sm:w-20 md:w-25 hover:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
        />
      </a>

      <div className="block lg:hidden z-20">
        <button
          onClick={toggleMobileMenu}
          className="text-pinegreen hover:text-mossgreen transition-all duration-200"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Search Bar - Hidden on mobile, visible from medium screens */}
      <div className="hidden md:block md:w-full lg:w-[40rem] lg:mx-auto lg:px-4 order-3 lg:order-2 mt-3 lg:mt-0">
        <SearchBar />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center order-2 lg:order-3">
        <div className="mr-5">
          <Link to="/favorites">
            <BarIcon icon={<FaHeart size={28} className="text-pinegreen" />} />
          </Link>
        </div>
        <div className="mr-5 relative tooltip tooltip-bottom" data-tip="hello">
          <Link to="/cart">
            <BarIcon
              icon={<FaShoppingCart size={28} className="text-pinegreen" />}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            {showNotification && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 animate-bounce-violent animate-color-change rounded-full w-5 h-5 opacity-75"></span>
            )}
          </Link>
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
        <div className="ml-2">
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

      {/* Mobile Search Bar - Visible only on small screens */}
      <div className="w-full order-4 mt-3 md:hidden">
        <SearchBar />
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden w-full order-5 transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-screen opacity-100 pt-4 pb-3" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="flex flex-col space-y-3 items-center">
          <div className="flex items-center justify-center relative">
            <BarIcon
              icon={<FaShoppingCart size={20} className="text-pinegreen" />}
            />
            <span className="ml-2 text-pinegreen">Handlekurv</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-10 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            {showNotification && cartCount > 0 && (
              <span className="absolute -top-2 -right-10 animate-ping bg-red-500 rounded-full w-5 h-5 opacity-75"></span>
            )}
          </div>
          <a href="https://minside.neas.no/register" className="w-full">
            <NavbarButton
              text={"Bli kunde ->"}
              bg={"bg-mossgreen"}
              textcolor={"text-pinegreen"}
              bghover={"hover:bg-mossgreen/85"}
            />
          </a>
          <a href="https://minside.neas.no/" className="w-full">
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
    <form className="w-full mx-auto font-mabrylight" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="search"
          name="search"
          id="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hva leter du etter?"
          maxLength={36}
          className="w-full rounded-full bg-white px-6 py-3 pr-12 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-green-950 sm:text-sm"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:scale-90 transition-all duration-150 ease-in-out cursor-pointer"
        >
          <BarIcon icon={<FaSearch size={18} />} text="Søk" />
        </button>
      </div>
    </form>
  );
}

function BarIcon({ icon, text }) {
  return (
    <div className="navbar-icon group relative hover:scale-90 transition-all duration-200 ease-in-out cursor-pointer">
      {icon}
      {text && <span className="sr-only">{text}</span>}
    </div>
  );
}

function NavbarButton({ text, bg, textcolor, texthover, bghover }) {
  return (
    <div className="w-full">
      <button
        className={`hover:scale-95 transition-all duration-200 ease-in-out cursor-pointer font-mabry text-base sm:text-lg md:text-xl rounded-full px-4 sm:px-5 md:px-7 py-2 md:py-3 w-full ${bg} ${textcolor} ${texthover} ${bghover}`}
      >
        {text}
      </button>
    </div>
  );
}

export { Navbar, NavbarButton };
