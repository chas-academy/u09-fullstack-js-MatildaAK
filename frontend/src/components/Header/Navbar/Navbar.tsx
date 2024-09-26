import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons'
import icon from '../../../assets/images/icon.svg'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    return (
        <nav className="bg-primaryLightGreen dark:bg-primaryDarkGreen">
            {/* Desktop Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden sm:flex justify-between h-16">
                <div className="flex items-center space-x-4">
                    <a href="/" className="text-black dark:text-white hover:text-primaryLightGreen">
                        Hem
                    </a>
                    <a href="/garden" className="text-black dark:text-white hover:text-primaryLightGreen">
                        Handelsträdgård
                    </a>
                    <a href="/cafe" className="text-black dark:text-white hover:text-primaryLightGreen">
                        Café
                    </a>
                    <a href="/book" className="text-black dark:text-white hover:text-primaryLightGreen">
                        Bokhandel
                    </a>
                </div>

                <div className="flex items-center justify-center">
                    <span className="text-white font-bold text-xl flex items-center">
                        MJs
                        <img className="h-12 w-12 ml-2" src={icon} alt="icon" />
                        <span className="ml-2">FlowerPot</span>
                    </span>
                </div>

                <div className="flex items-center space-x-4">
                    <a href="/cart" className="relative">
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            size="xl"
                            className="text-black dark:text-white"
                        />
                        <span className="relative px-2 w-5 h-5 rounded-full bg-secondaryLightBrown dark:bg-secondaryDarkBrown text-black dark:text-white medium-14 -top-2">
                            0
                        </span>
                    </a>
                    <a href="/login" className="text-black dark:text-white hover:text-primaryLightGreen">
                        Logga in
                    </a>
                </div>
            </div>

            {/* Mobile Navbar */}
            <div className="flex justify-between px-6 py-4 sm:hidden">
                <button
                    onClick={toggleMenu}
                    className="text-black dark:text-white focus:outline-none"
                >
                    <div className="space-y-1">
                        <span
                            className={`block w-6 h-0.5 bg-black dark:bg-white transform transition ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                        ></span>
                        <span
                            className={`block w-6 h-0.5 bg-black dark:bg-white transition ${isOpen ? 'opacity-0' : ''}`}
                        ></span>
                        <span
                            className={`block w-6 h-0.5 bg-black dark:bg-white transform transition ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                        ></span>
                    </div>
                </button>

                <a href="/" className="text-white font-medium text-sm flex items-center">
                    MJs
                    <img className="h-12 w-12 ml-2" src={icon} alt="icon" />
                    <span className="ml-2">FlowerPot</span>
                </a>

                <div className="flex items-center">
                    <a href="/cart" className="relative">
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            size="xl"
                            className="text-black dark:text-white"
                        />
                        <span className="relative px-2 w-5 h-5 rounded-full bg-secondaryLightBrown dark:bg-secondaryDarkBrown text-black dark:text-white medium-14 -top-2">
                            0
                        </span>
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

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden bg-primaryLightGreen dark:bg-primaryDarkGreen">
                    <a
                        href="/"
                        className="block px-4 py-2 text-black dark:text-white hover:bg-green-700"
                    >
                        Hem
                    </a>
                    <a
                        href="/cafe"
                        className="block px-4 py-2 text-black dark:text-white hover:bg-green-700"
                    >
                        Café
                    </a>
                    <a
                        href="/garden"
                        className="block px-4 py-2 text-black dark:text-white hover:bg-green-700"
                    >
                        Handelsträdgård
                    </a>
                    <a
                        href="/book"
                        className="block px-4 py-2 text-black dark:text-white hover:bg-green-700"
                    >
                        Bokhandel
                    </a>
                    <a
                        href="/about"
                        className="block px-4 py-2 text-black dark:text-white hover:bg-green-700"
                    >
                        Om MJs
                    </a>
                    <a
                        href="/user"
                        className="block px-4 py-2 text-black dark:text-white hover:bg-green-700"
                    >
                        Profil
                    </a>
                    <a
                        href="/faq"
                        className="block px-4 py-2 text-black dark:text-white hover:bg-green-700"
                    >
                        FAQ
                    </a>
                </div>
            )}
        </nav>
    )
}

export default Navbar
