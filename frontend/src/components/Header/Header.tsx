import Navbar from "./Navbar/Navbar";

interface HeaderProps {
    isAuthenticated: boolean;
    onLogout: () => void;
  }

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
    return (
        <>
        <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout}/>
        </>
    );
}

export default Header;