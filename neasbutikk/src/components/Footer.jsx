import { NavbarButton } from "./Navbar";

function FooterMain() {
  return (
    <div className="m-1">
      <div className="footer-wrapper font-mabrylight">
        <div className="bg-pinegreen text-white flex flex-col rounded-xl gap-2 w-full items-center shadow-lg p-2">
          <div className="flex flex-col w-full justify-between items-center p-4 bg-pinegreen-footer rounded-xl">
            <h2 className="text-mossgreen flex flex-col w-full mb-15 p-2">
              Kontakt oss
            </h2>
            <div className="mobile-numbers grid grid-cols-6 w-full ml-3 mb-2">
              <ContactNumberItem city={"Kristiansund"} number={"71 56 55 25"} />
              <ContactNumberItem
                city={"Oppdal & Rennebu"}
                number={"72 42 44 44"}
              />
              <ContactNumberItem city={"Røros"} number={"72 41 48 60"} />
              <ContactNumberItem city={"Elektro"} number={"71 56 65 00"} />
              <ContactNumberItem city={"IT"} number={"71 67 84 90"} />

              <div className="social-links block isolate">
                <ul className="flex flex-row gap-6 mt-10 ml-30">
                  <li className="">
                    <a href="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                        className="t2-icon t2-icon-facebook fill-white hover:fill-mossgreen"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M12 0C5.3844493 0 0 5.3844493 0 12c0 5.933719 4.3334302 10.874172 10 11.830078V15H8a1 1 0 0 1-1-1 1 1 0 0 1 1-1h2v-2.529297c0-.9125533.351936-1.7901889.986328-2.4433592C11.620901 7.3741173 12.491267 7 13.400391 7H15a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-1.599609c-.363874 0-.714845.1464908-.980469.4199219C12.154317 9.6933886 12 10.072762 12 10.470703V13h3a1 1 0 0 1 1 1 1 1 0 0 1-1 1h-3v9c6.615526 0 12-5.384474 12-12 0-6.615554-5.384477-12-12-12z"></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                        className="t2-icon t2-icon-instagram fill-white hover:fill-mossgreen"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M4 0C1.8013038 0 0 1.8013038 0 4v16c0 2.198697 1.8013038 4 4 4h16c2.198697 0 4-1.801303 4-4V4c0-2.1986962-1.801303-4-4-4H4zm15 4c.552298 0 1 .4477212 1 1 0 .5522788-.447702 1-1 1s-1-.4477212-1-1c0-.5522788.447702-1 1-1zm-7 2c3.301836 0 6 2.6981433 6 6 0 3.301841-2.698159 6-6 6-3.3018567 0-6-2.698164-6-6 0-3.3018519 2.6981481-6 6-6zm0 2c-2.2209716 0-4 1.7790284-4 4 0 2.220948 1.7790332 4 4 4 2.220943 0 4-1.779057 4-4 0-2.2209668-1.779052-4-4-4z"></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                        className="t2-icon t2-icon-linkedin fill-white hover:fill-mossgreen"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M4 0C1.8013038 0 0 1.8013038 0 4v16c0 2.198697 1.8013038 4 4 4h16c2.198697 0 4-1.801303 4-4V4c0-2.1986962-1.801303-4-4-4H4zm4 6c.5522788 0 1 .4477212 1 1 0 .5522788-.4477212 1-1 1-.5522788 0-1-.4477212-1-1 0-.5522788.4477212-1 1-1zm0 3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 .828125.4414062C13.334963 9.1567291 13.909398 9 14.5 9c.941127 0 1.840904.394526 2.492188 1.078125a1.0001 1.0001 0 0 0 0 .001953C17.643383 10.763916 18 11.676577 18 12.625V16a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-3.375c0-.443973-.17063-.865256-.457031-1.166016C15.256454 11.158235 14.88487 11 14.5 11c-.38487 0-.756454.158235-1.042969.458984C13.17063 11.759744 13 12.181027 13 12.625V16a1 1 0 0 1-1 1 1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z"></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        height="24"
                        width="24"
                        className="t2-icon t2-icon-youtube fill-white hover:fill-mossgreen"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M11.992188 3c-.020028-.0003303-5.8708106-.0959252-9.7480474 1.3183594a1.0001 1.0001 0 0 0-.0078125.0039062c-.3926824.1471189-.7475395.380901-1.0332031.6894532-.28501361.3078835-.4917081.682867-.59960938 1.0898437C.33289375 7.0997158 0 8.9396953 0 12c0 3.060348.33167354 4.899856.60742188 5.90625.10842522.404854.31604541.775773.59960932 1.082031a1.0001 1.0001 0 0 0 0 .001953c.2843141.30691.6368368.540292 1.0273438.6875a1.0001 1.0001 0 0 0 .0097656.003907C6.1280075 21.098277 12.003906 21 12.003906 21c.02003.00033 5.870821.095938 9.748047-1.318359a1.0001 1.0001 0 0 0 .007813-.001953c.392083-.146363.745818-.380634 1.03125-.6875.284269-.30562.492218-.676184.601562-1.080079v-.001953C23.66895 16.905032 24 15.06234 24 12c0-3.0581921-.329747-4.8953912-.605469-5.9023438l-.001953-.0019531c-.107828-.4071813-.314652-.7800832-.599609-1.0878906-.285588-.3084696-.640409-.5442651-1.033203-.6914063a1.0001 1.0001 0 0 0-.007813-.0039062C17.875558 2.9039862 12.023933 2.9996709 12.003906 3h-.011718zM9.9199219 8.5058594a.50005.50005 0 0 1 .3378901.0644531l5 2.9999995a.50005.50005 0 0 1 0 .859376l-5 3A.50005.50005 0 0 1 9.5 15V9a.50005.50005 0 0 1 .2539062-.4355469.50005.50005 0 0 1 .1660157-.0585937z"></path>
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text w-full">
            <div className="col-span-2 flex flex-col p-4 bg-pinegreen-footer rounded-xl">
              <h2 className="text-mossgreen mb-7 p-2">Om oss</h2>
              <div className="grid grid-cols-2 text-xl gap-x-5 gap-y-5 w-full ml-2 mt-4">
                <FooterLink text={"Kontakt"} />
                <FooterLink text={"Hva skjer i nabolaget?"} />
                <FooterLink text={"Om oss"} />
                <FooterLink text={"Neas forklarer"} />
                <FooterLink text={"Sponsorat"} />
                <FooterLink text={"Bærekraft"} />
                <FooterLink text={"Jobb hos oss"} />
                <FooterLink text={"Logo og profil"} />
              </div>
            </div>

            <div className="flex flex-col p-4 bg-pinegreen-footer rounded-xl">
              <h2 className="text-mossgreen mb-7 p-2">Snarveier</h2>
              <div className="flex flex-col text-xl gap-5 w-full ml-2 mt-4">
                <FooterLink text={"Webmail Nordmøre"} />
                <FooterLink text={"Webmail Oppdal"} />
                <FooterLink text={"Live kamera og vær"} />
                <FooterLink text={"Driftsmeldinger"} />
                <FooterLink text={"Flytte?"} />
              </div>
            </div>

            <div className="flex flex-col p-4 bg-pinegreen-footer rounded-xl">
              <h2 className="text-mossgreen mb-7 p-2">Annet</h2>
              <div className="flex flex-col text-xl gap-5 w-full ml-2 mt-4">
                <FooterLink text={"Strømguiden"} />
                <FooterLink text={"Historiske strømpriser"} />
                <FooterLink text={"Personvern og Cookies"} />
                <FooterLink text={"Vilkår og betingelser"} />
                <FooterLink text={"Grossist"} />
                <FooterLink text={"Hjelp"} />
              </div>
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
      <div className="phone-title text-breadtext">{city}</div>
      <div className="phone-number text-2xl mt-3">{number}</div>
    </div>
  );
}

function FooterLink({ text }) {
  return (
    <div className="about-us-item flex flex-col w-full">
      <a href="#">
        <h2 className="about-us-text hover:underline">{text}</h2>
      </a>
    </div>
  );
}

export default FooterMain;
