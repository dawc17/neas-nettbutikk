function ProductCard( {productName, productDescription, productPrice, image, altText, altImage} ) {
    return (
        <div className="product-card bg-lightgray flex flex-col items-center p-4 rounded-xl gap-2">
            <img src={image} alt={altText} className="w-50 h-auto mt-5 scale-100 hover:scale-130 hover:translate-y-5 transition-all duration-200 ease-in-out" />
            <Divider />
            <h3 className="font-mabry text-pinegreen">{productName}</h3>
            <p className="font-mabrylight text-pinegreen">{productDescription}</p>
            <p className="font-mabry text-pinegreen">{productPrice} NOK</p>
            <button className="bg-mossgreen text-pinegreen font-mabrylight rounded-xl px-2 py-1 w-full cursor-pointer scale-100 hover:scale-95 hover:bg-pinegreen hover:text-sunlightyellow transition-all duration-150">
                Les mer
            </button>
        </div>
    );
}

function Divider() {
    return (
        <div className="divider bg-pinegreen h-0.5 m-5 w-full"></div>
    );
}

export default ProductCard