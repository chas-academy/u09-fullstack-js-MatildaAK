import { Link } from "react-router-dom";
import logo from "../../../../public/designer.svg";
import profileImg from "../../../assets/icon.svg";
import { useEffect, useRef, useState } from "react";
import { IUser } from "../../../interface/IUser";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const [userData, setUserData] = useState<IUser>({
    userName: "",
    image: "",
    name: "",
    email: "",
    password: "",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;

      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        console.log("Hämtar ID:", id);
        console.log("Hämtar Token:", token);

        if (!id || !token) {
          throw new Error("User ID or token not found");
        }

        const response = await fetch(`http://localhost:4000/admin/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        console.log("Inloggad användare:", data);
      } catch (error) {
        console.error("Fetch user data error:", error);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsDropdownVisible(false);
  }, [isAuthenticated]);

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);
  const closeDropdown = () => setIsDropdownVisible(false);

  return (
    <nav className="flex items-center justify-between py-2 px-5 text-black dark:text-white bg-secondaryLightBrown  dark:bg-thirdDarkBlue ring-1 ring-thirdLightBlue dark:ring-thirdDarkBlue relative">
      <a href="/admin">
        <img src={logo} alt="Logo" className="h-12 w-12" />
      </a>
      <a
        href="/admin"
        className="uppercase font-bold text-black dark:text-white bg-primaryLightGreen dark:bg-primaryDarkGreen px-3 rounded-md tracking-widest line-clamp-1"
      >
        Admin panel
      </a>

      {isAuthenticated ? (
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className="bg-primaryLightGreen dark:bg-primaryDarkGreen p-2 rounded-md"
          >
            {userData.userName}
          </button>
          {isDropdownVisible && (
            <div className="text-black dark:text-white bg-primaryLightGreen dark:bg-primaryDarkGreen absolute top-[100%] border-1 border-white z-50">
              <Link
                to={"/"}
                onClick={onLogout}
                style={{
                  display: "block",
                  padding: "10px",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Logga ut
              </Link>
              <Link
                to={"/#"}
                onClick={closeDropdown}
                style={{
                  display: "block",
                  padding: "10px",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Profil
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link to={"/login"}>
          <img
            src={profileImg}
            alt="Profil bild"
            className="h-12 w-12 rounded-full"
          />
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
