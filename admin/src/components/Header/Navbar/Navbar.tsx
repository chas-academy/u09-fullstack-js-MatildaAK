import logo from "../../../../public/designer.svg";
import profileImg from "../../../assets/icon.svg"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-2 px-4 text-black dark:text-white bg-secondaryLightBrown  dark:bg-black/70 ring-1 ring-thirdLightBlue dark:ring-thirdDarkBlue relative ">
      <div><img src={logo} alt="Logo" className="h-12 w-12" /></div>
      <div className="uppercase font-bold text-black dark:text-white bg-primaryLightGreen dark:bg-primaryDarkGreen px-3 rounded-md tracking-widest line-clamp-1">Admin panel</div>
      <div><img src={profileImg} alt="Profil bild" className="h-12 w-12 rounded-full" /></div>
    </nav>
  );
};

export default Navbar;
