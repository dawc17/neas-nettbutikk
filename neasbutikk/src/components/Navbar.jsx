import { FaSearch, FaShoppingCart } from "react-icons/fa";

function Navbar() {
  return (
    <div className="bg-white text-black flex items-center fixed top-0 w-full shadow-lg h-16 px-4">
      <img
        src="/neas.svg"
        alt="Logo"
        className="h-auto w-30 hover:scale-90 transition-all duration-300 ease-in-out cursor-pointer"
      />
      <div className="flex flex-grow justify-center">
        <SearchBar />
      </div>
      <div className="flex items-center">
        <div className="m-1">
          <BarIcon icon={<FaShoppingCart size={28} />} />
        </div>
        <div className="m-1">
          <NavbarButton text={"Bli kunde ->"} bg={"bg-green-500"}/>
        </div>
        <div className="m-1">
          <NavbarButton text={"Min side ->"} bg={"bg-green-900"} />
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <form className="w-full max-w-md" action="#">
      <div className="relative">
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Hva leter du etter?"
          className="w-full rounded-full bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-green-950 sm:text-sm"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:scale-90 transition-all duration-150 ease-in-out cursor-pointer">
          <BarIcon icon={<FaSearch size={20} />} text="Søk" />
        </div>
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

function NavbarButton({text, bg}) {
  return (
    <div>
      <button className={`hover:scale-90 transition-all duration-200 ease-in-out cursor-pointer rounded-full px-3 py-1 w-full text-base ${bg}`}>
        {text}
      </button>
    </div>
  )
}

export default Navbar;
