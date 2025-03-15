import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CartOverlay from "./CartOverlay";
import FavoritesOverlay from "./FavoritesOverlay";
import SearchBar from "./SearchBar";
import NavbarButton from "./NavbarButton";
import BarIcon from "./BarIcon";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  const [showFavoritesOverlay, setShowFavoritesOverlay] = useState(false);
  const { getCartCount, showNotification } = useCart();
  const cartCount = getCartCount();
  
  const cartTimeoutRef = useRef(null);
  const favoritesTimeoutRef = useRef(null);
  const [isMouseOverCart, setIsMouseOverCart] = useState(false);
  const [isMouseOverCartOverlay, setIsMouseOverCartOverlay] = useState(false);
  const [isMouseOverFavorites, setIsMouseOverFavorites] = useState(false);
  const [isMouseOverFavoritesOverlay, setIsMouseOverFavoritesOverlay] = useState(false);

  // Clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
      if (favoritesTimeoutRef.current) clearTimeout(favoritesTimeoutRef.current);
    };
  }, []);

  // cart overlay
  useEffect(() => {
    if (isMouseOverCart || isMouseOverCartOverlay) {
      setShowCartOverlay(true);
      setShowFavoritesOverlay(false);
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    } else {
      cartTimeoutRef.current = setTimeout(() => {
        setShowCartOverlay(false);
      }, 300);
    }
  }, [isMouseOverCart, isMouseOverCartOverlay]);


  // favorites overlay
  useEffect(() => {
    if (isMouseOverFavorites || isMouseOverFavoritesOverlay) {
      setShowFavoritesOverlay(true);
      setShowCartOverlay(false);
      if (favoritesTimeoutRef.current) clearTimeout(favoritesTimeoutRef.current);
    } else {
      favoritesTimeoutRef.current = setTimeout(() => {
        setShowFavoritesOverlay(false);
      }, 300);
    }
  }, [isMouseOverFavorites, isMouseOverFavoritesOverlay]);

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

      {/* desktop search bar */}
      <div className="hidden md:block md:w-full lg:w-[40rem] lg:mx-auto lg:px-4 order-3 lg:order-2 mt-3 lg:mt-0">
        <SearchBar />
      </div>

      {/* dektop navigation */}
      <div className="hidden lg:flex items-center order-2 lg:order-3">
        <div
          className="mr-5 relative"
          onMouseEnter={() => setIsMouseOverFavorites(true)}
          onMouseLeave={() => setIsMouseOverFavorites(false)}
        >
          <Link to="/favorites">
            <BarIcon icon={<FaHeart size={28} className="text-pinegreen" />} />
          </Link>
          <div 
            className="absolute z-50" 
            onMouseEnter={() => setIsMouseOverFavoritesOverlay(true)}
            onMouseLeave={() => setIsMouseOverFavoritesOverlay(false)}
          >
            <FavoritesOverlay
              isVisible={showFavoritesOverlay}
              onClose={() => {
                setIsMouseOverFavoritesOverlay(false);
                setShowFavoritesOverlay(false);
              }}
            />
          </div>
        </div>
        <div
          className="mr-5 relative"
          onMouseEnter={() => setIsMouseOverCart(true)}
          onMouseLeave={() => setIsMouseOverCart(false)}
        >
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
          <div 
            className="absolute z-50" 
            onMouseEnter={() => setIsMouseOverCartOverlay(true)}
            onMouseLeave={() => setIsMouseOverCartOverlay(false)}
          >
            <CartOverlay
              isVisible={showCartOverlay}
              onClose={() => {
                setIsMouseOverCartOverlay(false);
                setShowCartOverlay(false);
              }}
            />
          </div>
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

      {/* mobile search bar */}
      <div className="w-full order-4 mt-3 md:hidden">
        <SearchBar />
      </div>

      {/* mobile navigation */}
      <div
        className={`lg:hidden w-full order-5 transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-screen opacity-100 pt-4 pb-3" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="flex flex-col space-y-3 items-center">
          <Link to="/cart" className="flex items-center justify-center relative w-full">
            <div className="flex items-center justify-center py-2 px-4 rounded-lg hover:bg-gray-100 w-full">
              <FaShoppingCart size={20} className="text-pinegreen" />
              <span className="ml-2 text-pinegreen">Handlekurv</span>
              {cartCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>
          
          <Link to="/favorites" className="flex items-center justify-center relative w-full">
            <div className="flex items-center justify-center py-2 px-4 rounded-lg hover:bg-gray-100 w-full">
              <FaHeart size={20} className="text-pinegreen" />
              <span className="ml-2 text-pinegreen">Favoritter</span>
            </div>
          </Link>
          
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

export default Navbar;
