import "../index.css";

function EasterEgg() {
  return (
    <div className="relative grid grid-cols-3 grid-rows-1 place-items-center h-screen bg-black font-mabry text-white">
      <div className="absolute inset-0 m-0 bg-[url('https://lukasz.langa.pl/a01d8a5d-3631-4c5b-8b68-a4750d4d0b84/assets/bateman.jpg')] bg-cover bg-center blur-sm"></div>
      <div className="relative rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col items-center justify-center p-6 max-w-md bg-black/15 overflow-hidden">
        <h1 className="text-4xl text-center mb-2">her er vi ja</h1>
        <p className="mb-4 text-center">sigamene som lagde dette</p>
        <div className="flex flex-row justify-center items-start space-x-4 w-full">
          <div className="flex flex-col items-center w-[45%]">
            <img
              className="w-full h-auto"
              src="https://images2.imgbox.com/bb/01/9jz6bpEM_o.png"
              alt=""
            />
            <p className="mt-2 text-center text-sm text-white font-mabrylight">
              Dawid "Alpha" Czaplicki
            </p>
          </div>
          <div className="relative group flex flex-col items-center w-[47%] font-mabrylight">
            <img
              className="w-full h-auto "
              src="https://images2.imgbox.com/1d/9c/IbuuQvjP_o.png"
              alt=""
            />
            <p className="mt-2 text-center text-sm text-white">
              John-Benjamin "Beta" Kvisvik
            </p>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-rainbow-bg"></div>
          </div>
        </div>
      </div>
      <div className="relative col-start-3 bg-gray-400/30 w-64 h-64 rounded-lg overflow-hidden">
        <img
          src="https://media1.tenor.com/m/yHJ3VencyPEAAAAC/chiefkeef-sosababy.gif"
          alt="Chief Keef GIF"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default EasterEgg;
