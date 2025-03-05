import { FaSearch, FaShoppingCart } from "react-icons/fa";

function Navbar() {
  return (
    <div className="bg-white text-black flex items-center rounded-2xl fixed top-0 w-full shadow-lg h-25 px-6">
      <a href="https://neas.no" target="_blank">
        <img
          src="/neas.svg"
          alt="Logo"
          className="h-auto w-25 hover:scale-120 transition-all duration-300 ease-in-out cursor-pointer"
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
          <NavbarButton text={"Bli kunde ->"} bg={"bg-mossgreen"} textcolor={"text-pinegreen"} bghover={"hover:bg-mossgreen/85"}/>
        </div>
        <div className="ml-3.5">
          <NavbarButton text={"Min side ->"} bg={"bg-pinegreen"} textcolor={"text-white"} texthover={"hover:text-sunlightyellow"} bghover={"hover:bg-pinegreen/85"}/>
        </div>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <form className="w-full max-w-md font-mabrylight" action="#">
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

function NavbarButton({text, bg, textcolor, texthover, bghover}) {
  return (
    <div>
      <button className={`hover:scale-95 transition-all duration-200 ease-in-out cursor-pointer font-mabry text-xl rounded-full px-7 py-3 w-full ${bg} ${textcolor} ${texthover} ${bghover}`}>
        {text}
      </button>
    </div>
  )
}

export default Navbar;
