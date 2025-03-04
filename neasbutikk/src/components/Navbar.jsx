import { FaSearch } from "react-icons/fa";

function Navbar() {
  return (
    <>
      <div className="bg-white text-black flex flex-row fixed top-0 w-screen m-0 shadow-lg h-16">
        <img
          src="/neas.svg"
          className="relative flex items-center justify-center h-12 w-30 mt-2 mb-2 mx-4 hover:scale-90 transition-all duration-100 ease-in-out cursor-pointer"
        />
      </div>
      <div className="fixed left-200">
        <SearchBar />
      </div>
    </>
  );
}

function SearchBar() {
  return (
    <form className="py-3.5" action="#">
      <div>
        <div>
          <input
            type="search-neas"
            name="search-neas"
            id="search-neas"
            placeholder="Hva leter du etter?"
            className="flex w-full rounded-4xl bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-green-950 sm:text-sm/6"
          />
          <BarIcon icon={<FaSearch size="28" />} />
        </div>
      </div>
    </form>
  );
}

function BarIcon({ icon, text = "Søk" }) {
  return (
    <div className="navbar-icon group">
      {icon}

      <span className="navbar-tooltip group-hover:scale-100">{text}</span>
    </div>
  );
}

export default Navbar;
