import { NavbarButton } from "./Navbar";

function FooterMain() {
  return (
    <div>
      <div className="footer-wrapper font-mabrylight">
        <div className="bg-pinegreen text-white flex flex-col rounded-xl gap-2 w-full items-center shadow-lg p-4">
          <div className="flex flex-row w-full justify-between items-center p-4 bg-pinegreen-footer rounded-xl">
            <h2 className="text-breadtext mb-15">Kontakt oss</h2>
            <div className="mobile-numbers grid grid-cols-5 gap-2 w-full">
              <ContactNumberItem city={"Kristiansund"} number={"71 56 55 25"} />
              <ContactNumberItem
                city={"Oppdal & Rennebu"}
                number={"72 42 44 44"}
              />
              <ContactNumberItem city={"Røros"} number={"72 41 48 60"} />
              <ContactNumberItem city={"Elektro"} number={"71 56 65 00"} />
              <ContactNumberItem city={"IT"} number={"71 67 84 90"} />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 w-full">
            <div className="col-span-2 flex items-center justify-between p-4 bg-pinegreen-footer rounded-xl">
              <h2 className="text-breadtext mb-15">Om oss</h2>
            </div>
            <div className="flex items-center justify-between p-4 bg-pinegreen-footer rounded-xl">
              <h2 className="text-breadtext mb-15">Snarveier</h2>
            </div>
            <div className="flex items-center justify-between p-4 bg-pinegreen-footer rounded-xl">
              <h2 className="text-breadtext mb-15">Annet</h2>
            </div>
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
    </div>
  );
}

function ContactNumberItem({ city, number }) {
  return (
    <div className="phone-item flex flex-col w-full">
      <div className="phone-title">{city}</div>
      <div className="phone-number">{number}</div>
    </div>
  );
}

export default FooterMain;
