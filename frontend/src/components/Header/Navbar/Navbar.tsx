import icon from "../../../assets/images/icon.svg";

const Navbar = () => {
  return (
    <>
      <nav className="bg-primaryLightGreen dark:bg-primaryDarkGreen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden sm:flex">
          <div className="flex justify-between h-16">
            <div className="basis-1/4 flex items-center justify-center">
              <a
                href="/"
                className="text-black dark:text-white hover:text-gray-300 flex items-center"
              >
                Hem
              </a>
              <a
                href="/garden"
                className="text-black dark:text-white hover:text-gray-300 flex items-center"
              >
                Handelsträdgård
              </a>
              <a
                href="/cafe"
                className="text-black dark:text-white hover:text-gray-300 flex items-center"
              >
                Café
              </a>
            </div>
            <div className="flex items-center justify-center basis-1/2">
              <span className="text-white font-bold text-xl flex items-center">
                MJs
                <img className="h-12 w-12 ml-2" src={icon} alt="icon" />
                <span className="ml-2">FlowerPot</span>
              </span>
            </div>
            <div className="basis-1/4 flex items-center justify-center">
              <a
                href="/book"
                className="text-black dark:text-white hover:text-gray-300 flex items-center"
              >
                Bokhandel
              </a>
              <a
                href="/login"
                className="text-black dark:text-white hover:text-gray-300 flex items-center"
              >
                Logga in
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
