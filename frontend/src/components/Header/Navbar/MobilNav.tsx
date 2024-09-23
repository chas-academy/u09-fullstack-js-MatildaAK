import { useState } from "react";
import icon from "../../../assets/images/icon.svg";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MobilNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex justify-between px-6 py-4 sm:hidden bg-primaryLightGreen dark:bg-primaryDarkGreen">
        <button
          onClick={toggleMenu}
          className="text-black dark:text-white focus:outline-none"
        >
          <div className="space-y-1">
            <span
              className={`block w-6 h-0.5 bg-black dark:bg-white transform transition ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-black dark:bg-white transition ${
                isOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-black dark:bg-white transform transition ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </div>
        </button>

        <a href="/">
          <span className="text-white font-medium text-sm flex items-center">
            MJs
            <img className="h-12 w-12 ml-2" src={icon} alt="icon" />
            <span className="ml-2">FlowerPot</span>
          </span>
        </a>
        <div className="flex items-center">
          <a href="/cart">
            <FontAwesomeIcon
              icon={faCartShopping}
              size="xl"
              className="text-black dark:text-white"
            />
            <span className="relative flexCenter px-2 w-5 h-5 rounded-full bg-secondaryLightBrown dark:bg-secondaryDarkBrown text-black dark:text-white medium-14 -top-2">0</span>
          </a>
          <a href="/login" className="ml-4">
            <FontAwesomeIcon
              icon={faUser}
              size="xl"
              className="text-black dark:text-white"
            />
          </a>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-primaryLightGreen dark:bg-primaryDarkGreen">
          <a
            href="/"
            className="block px-4 py-2 text-black dark:text-white  hover:bg-green-700"
          >
            Hem
          </a>
          <a
            href="/cafe"
            className="block px-4 py-2 text-black dark:text-white  hover:bg-green-700"
          >
            Café
          </a>
          <a
            href="/garden"
            className="block px-4 py-2 text-black dark:text-white  hover:bg-green-700"
          >
            Handelsträdgård
          </a>
          <a
            href="/book"
            className="block px-4 py-2 text-black dark:text-white  hover:bg-green-700"
          >
            Bokhandel
          </a>
          <a
            href="/about"
            className="block px-4 py-2 text-black dark:text-white  hover:bg-green-700"
          >
            Om M&Js
          </a>
          <a
            href="/user"
            className="block px-4 py-2 text-black dark:text-white  hover:bg-green-700"
          >
            Profil
          </a>
          <a
            href="/faq"
            className="block px-4 py-2 text-black dark:text-white  hover:bg-green-700"
          >
            FAQ
          </a>
        </div>
      )}
    </>
  );
};

export default MobilNav;
