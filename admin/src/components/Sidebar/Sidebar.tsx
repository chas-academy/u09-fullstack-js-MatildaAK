import { faFolderOpen, faFolderPlus, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="py-7 flex justify-center flex-wrap gap-x-1 gap-y-5 w-full bg-thirdLightBlue/30 dark:bg-thirdDarkBlue/30 sm:gap-x-4 lg:flex-col lg:pt-20 lg:max-w-60 lg:h-screen lg:justify-start lg:pl-6">
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
          <span>Lägg till användare</span>
        </button>
      </Link>
      <Link to={"/anvandare/alla"}>
        <button className="flex justify-center gap-2 rounded-md text-black dark:text-white bg-primaryLightGreen dark:bg-primaryDarkGreen font-medium px-2">
        <FontAwesomeIcon icon={faUsers} className="h-[55px] w-[55px] text-white" />
          <span>Se alla användare</span>
        </button>
      </Link>
    </div>
  );
};

export default Sidebar;
