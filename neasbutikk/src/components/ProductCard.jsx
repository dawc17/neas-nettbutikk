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

  const extendedDescription = `
    ${productDescription}
    
    Spesifikasjoner:
    - Produsert med bærekraftige materialer
    - Håndlaget i Norge
    - Slitesterk og holdbar konstruksjon
    - Leveres i miljøvennlig emballasje
    
    Vedlikehold:
    Dette produktet er designet for å vare lenge med riktig vedlikehold. Vi anbefaler å rengjøre det regelmessig med en fuktig klut. Unngå sterke kjemikalier som kan skade overflaten.
    
    Historie:
    Denne kolleksjonen er inspirert av norsk natur og tradisjoner. Hver detalj har blitt nøye utformet av våre dyktige håndverkere som har flere tiårs erfaring.
    
    Garanti:
    Vi er stolte av kvaliteten på våre produkter, og derfor kommer de med en 2-års garanti mot produksjonsfeil.
    
    Levering:
    Normal leveringstid er 3-5 virkedager i Norge. For internasjonal frakt, ta kontakt med kundeservice.
    
    Retur:
    Vi aksepterer retur innen 30 dager etter mottak hvis du ikke er helt fornøyd med kjøpet ditt. Produktet må returneres i originalemballasjen.
  `;

  return (
    <>
      <div
        className={`product-card bg-lightgray flex flex-col items-center p-4 rounded-xl gap-5 group ${
          isOverlayOpen ? "blur-sm" : ""
        } h-[32rem] w-full`}
      >
        <img
          src={image}
          alt={altText}
          className="w-50 h-40 object-contain mt-5 scale-100 hover:scale-120 hover:translate-y-5 transition-all duration-200 ease-in-out"
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

      {isOverlayOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 z-50 flex items-center justify-center p-4 hide-scrollbar">
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
                  {extendedDescription}
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
      )}
    </>
  );
}

export default ProductCard;
