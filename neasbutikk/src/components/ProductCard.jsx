import { useState, useEffect } from "react";

function Divider() {
  return (
    <div className="divider bg-pinegreen h-0.5 m-5 w-full transition-all duration-200 ease-in-out group-hover:w-1/2 group-hover:bg-mossgreen"></div>
  );
}

function ProductCard({
  productName,
  productDescription,
  productPrice,
  image,
  altText,
  altImage,
  extendedDescription,
}) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOverlayOpen]);

  return (
    <>
      <div className="product-card bg-lightgray flex flex-col items-center p-4 rounded-xl gap-5 group h-[32rem] w-full">
        <img
          src={image}
          alt={altText}
          className="w-50 h-40 object-contain mt-5 scale-100 group-hover:scale-120 transition-all duration-200 ease-in-out"
        />
        <Divider />
        <h3 className="font-mabry text-pinegreen h-14 line-clamp-2 text-center w-full">
          {productName}
        </h3>
        <p className="font-mabrylight text-pinegreen h-20 line-clamp-3 text-center w-full">
          {productDescription}
        </p>
        <p className="font-mabry text-pinegreen">{productPrice} NOK</p>
        <button
          onClick={() => setIsOverlayOpen(true)}
          className="bg-mossgreen text-pinegreen font-mabrylight rounded-xl px-2 py-1 w-full cursor-pointer scale-100 hover:scale-95 hover:bg-pinegreen hover:text-sunlightyellow transition-all duration-150 mt-auto"
        >
          Les mer
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-in-out ${
          isOverlayOpen
            ? "backdrop-blur-md bg-white/30 opacity-100 visible"
            : "backdrop-blur-none bg-white/0 opacity-0 invisible"
        }`}
      >
        <div className="bg-lightgray rounded-xl w-full h-full md:w-11/12 md:h-5/6 lg:max-w-4xl relative shadow-2xl flex flex-col overflow-hidden hide-scrollbar">
          <div className="p-6 flex justify-between items-center border-b border-pinegreen/20">
            <h2 className="font-mabry text-pinegreen text-2xl">
              {productName}
            </h2>
            <button
              onClick={() => setIsOverlayOpen(false)}
              className="text-pinegreen hover:text-mossgreen text-xl p-2"
            >
              ✕
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 pb-24 hide-scrollbar">
            <img
              src={image}
              alt={altText}
              className="w-full md:w-2/3 mx-auto h-auto mb-6"
            />

            <div>
              <h3 className="font-mabry text-pinegreen text-xl mb-2">
                Beskrivelse
              </h3>
              <div className="font-mabrylight text-pinegreen whitespace-pre-line">
                {productDescription}
                <p className="mt-5">{extendedDescription}</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-lightgray py-4 px-6 border-t border-pinegreen/20 shadow-lg">
            <div className="flex justify-between items-center">
              <p className="font-mabry text-pinegreen text-2xl">
                {productPrice} NOK
              </p>
              <button className="bg-mossgreen text-pinegreen font-mabry rounded-xl px-4 py-2 cursor-pointer hover:bg-pinegreen hover:text-sunlightyellow hover:scale-90 transition-all duration-150">
                Kjøp nå
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
