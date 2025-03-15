function BarIcon({ icon, text }) {
    return (
      <div className="navbar-icon group relative hover:scale-90 transition-all duration-200 ease-in-out cursor-pointer">
        {icon}
        {text && <span className="sr-only">{text}</span>}
      </div>
    );
  }

export default BarIcon;