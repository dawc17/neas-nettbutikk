import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/priceFormatter";
import { FaShoppingCart } from "react-icons/fa";

function CartOverlay({ isVisible, onClose }) {
  const { cartItems, getCartTotal } = useCart();
  const total = getCartTotal();

  if (!isVisible) return null;

  return (
    <div
      className={`absolute top-full right-0 mt-2 w-80 bg-base-100 rounded-xl shadow-xl border border-base-300 z-50 transition-all duration-200 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      onMouseLeave={onClose}
    >
      {/* Fixed Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <h3 className="font-mabry text-primary text-lg">Din handlekurv</h3>
          <span className="font-mabrylight text-primary">
            {cartItems.length}{" "}
            {cartItems.length === 1 ? "produkt" : "produkter"}
          </span>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="max-h-64 overflow-y-auto hide-scrollbar">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3 border-b border-base-300 flex items-center gap-3"
              >
                <div className="w-14 h-14 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-mabrylight text-primary text-sm line-clamp-1">
                    {item.productName}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-primary">
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                    <span className="font-mabry text-primary text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-base-300 bg-base-100 rounded-b-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mabrylight text-primary">
                Sum totalt:
              </span>
              <span className="font-mabry text-primary text-lg">
                {formatPrice(total)}
              </span>
            </div>

            <Link
              to="/cart"
              className="bg-secondary text-primary font-mabry rounded-lg w-full py-2 text-center block hover:bg-primary hover:text-secondary-content transition-all duration-200"
            >
              Gå til handlekurv
            </Link>
          </div>
        </>
      ) : (
        <div className="p-6 text-center rounded-b-xl">
          <FaShoppingCart size={24} className="text-gray-300 mx-auto mb-2" />
          <p className="font-mabrylight text-primary mb-2">
            Handlekurven er tom
          </p>
          <Link to="/" className="text-secondary text-sm hover:underline">
            Fortsett å handle
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartOverlay;
