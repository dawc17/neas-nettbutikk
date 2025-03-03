import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <h1 className="text-xl font-medium text-black dark:text-white">
          NEAS Nettbutikk
        </h1>
        <p className="text-gray-500 dark:text-gray-400">pordukt</p>
      </div>
    </>
  );
}

export default App;
