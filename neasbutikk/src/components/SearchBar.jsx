import { useNavigate } from "react-router";
import { useState } from "react";
import BarIcon from "./BarIcon";
import { FaSearch } from "react-icons/fa";

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
          className="w-full rounded-full bg-base-300 px-6 py-3 pr-12 text-base text-primary outline outline-primary placeholder:text-gray-400 focus:outline-2 focus:outline-primary sm:text-sm"
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

export default SearchBar;
