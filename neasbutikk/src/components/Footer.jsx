import { NavbarButton } from "./Navbar";

function FooterMain() {
  return (
    <div className="footer-wrapper">
      <div className="bg-pinegreen text-white flex flex-col rounded-xl gap-2 w-full items-center shadow-lg p-4">
        <div className="flex flex-row w-full justify-between items-center p-4 bg-pinegreen-footer rounded-xl"></div>

        <div className="grid grid-cols-4 gap-2 w-full">
          <div className="col-span-2 flex items-center justify-center p-4 bg-pinegreen-footer rounded-xl"></div>
          <div className="flex items-center justify-center p-4 bg-pinegreen-footer rounded-xl"></div>
          <div className="flex items-center justify-center p-4 bg-pinegreen-footer rounded-xl"></div>
        </div>

        <div className="flex flex-row w-full justify-between items-center p-4 bg-mossgreen rounded-xl">
          <a href="https://neas.no">
            <img
              src="/neas.svg"
              alt="Logo"
              className="h-auto m-3.5 w-25 hover:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
            />
          </a>

          <div>
            <a href="https://minside.neas.no/">
              <NavbarButton
                text={"Logg inn ->"}
                bg={"bg-pinegreen"}
                textcolor={"text-white"}
                bghover={"hover:bg-pinegreen/85"}
                texthover={"hover:text-sunlightyellow"}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FooterMain;
