import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set } from "firebase/database";

export const products = [
  {
    productName: 'Lenovo ThinkPad E14 G6 14" Full HD+',
    productDescription:
      "En perfekt laptop, for en perfekt mann, i en perfekt verden.",
    productPrice: "1999",
    image: "/productImages/laptop.png",
    altText: "Laptop",
    extendedDescription: "Lorem ipsum kys!!!.",
  },
  {
    productName: "Lenovo ThinkPad Hybrid Docking",
    productDescription:
      "En perfekt laptop, for en perfekt mann, i en perfekt verden.",
    productPrice: "1999",
    image: "/productImages/dock.png",
    altText: "Laptop",
    extendedDescription: "Lorem ipsum kys.",
  },
  {
    productName: "Logitech MK850 Combo Trådløs",
    productDescription:
      "En perfekt laptop, for en perfekt mann, i en perfekt verden.",
    productPrice: "1999",
    image: "/productImages/keyboard1.png",
    altText: "Laptop",
    extendedDescription: "Lorem ipsum kys.",
  },
  {
    productName: 'Samsung 49" ViewFinity Curved skjerm S49C950',
    productDescription:
      "En perfekt laptop, for en perfekt mann, i en perfekt verden.",
    productPrice: "1999",
    image: "/productImages/screen.png",
    altText: "Laptop",
    extendedDescription: "Lorem ipsum kys.",
  },
  {
    productName: "Svive Styx RtP Gaming Musematte XXL",
    productDescription:
      "En perfekt laptop, for en perfekt mann, i en perfekt verden.",
    productPrice: "1999",
    image: "/productImages/mousepad.png",
    altText: "Laptop",
    extendedDescription: "Lorem ipsum kys.",
  },
];

const firebaseConfig = {
  apiKey: "AIzaSyDvyh73cj0xDmkVSMrfy8wD1V2C0nL9bzg",
  authDomain: "neas-nettbutikk-cb665.firebaseapp.com",
  projectId: "neas-nettbutikk-cb665",
  storageBucket: "neas-nettbutikk-cb665.firebasestorage.app",
  messagingSenderId: "401615206029",
  appId: "1:401615206029:web:9fbb8df70c18f999f394c4",
  measurementId: "G-404KWWNX03",
  databaseURL:
    "https://neas-nettbutikk-cb665-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

/*

function writeUserData(
  productName,
  title,
  shortText,
  price,
  imageUrl,
  longText
) {
  const db = getDatabase();
  set(ref(db, "products/" + productName), {
    title: title,
    descriptionShort: shortText,
    price: price,
    imageUrl: imageUrl,
    descriptionLong: longText,
  });
}

writeUserData(
  "LenovoLaptop",
  "Lenovo Laptop",
  "Sigma laptop sigma.",
  "1999",
  "null",
  "This is a long desctrion of the product."
);

*/
