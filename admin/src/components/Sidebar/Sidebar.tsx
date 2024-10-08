import { faFolderOpen, faFolderPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="py-7 flex justify-center gap-x-1 gap-y-5 w-full bg-thirdLightBlue/30 dark:bg-thirdDarkBlue/30 sm:gap-x-4 lg:flex-col lg:pt-20 lg:max-w-60 lg:h-screen lg:justify-start lg:pl-6">
      <Link to={"/skapa"}>
        <button className="flex justify-center gap-2 rounded-md text-black dark:text-white bg-primaryLightGreen dark:bg-primaryDarkGreen font-medium px-2">
          <FontAwesomeIcon
            icon={faFolderPlus}
            className="h-[55px] w-[55px] text-white"
          />
          <span>Lägg till produkt</span>
        </button>
      </Link>
      <Link to={"/produkter"}>
        <button className="flex justify-center gap-2 rounded-md text-black dark:text-white bg-primaryLightGreen dark:bg-primaryDarkGreen font-medium px-2">
          <FontAwesomeIcon
            icon={faFolderOpen}
            className="h-[55px] w-[55px] text-white"
          />
          <span>Se alla produkter</span>
        </button>
      </Link>
      <Link to={"/anvandare"}>
        <button className="flex justify-center gap-2 rounded-md text-black dark:text-white bg-primaryLightGreen dark:bg-primaryDarkGreen font-medium px-2">
        <FontAwesomeIcon icon={faUserPlus} className="h-[55px] w-[55px] text-white" />
          <span>Skapa användare</span>
        </button>
      </Link>
    </div>
  );
};

export default Sidebar;
