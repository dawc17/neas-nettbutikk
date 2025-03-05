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

        <div className="flex flex-row w-full justify-between items-center p-4 bg-mossgreen rounded-xl"></div>
      </div>
    </div>
  );
}

export default FooterMain;
