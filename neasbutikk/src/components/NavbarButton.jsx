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

export default NavbarButton;