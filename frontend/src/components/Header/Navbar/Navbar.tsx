import { useContext, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faUserTie } from '@fortawesome/free-solid-svg-icons'
import icon from '../../../assets/images/icon.svg'
import { ShopContext } from '../../../Context/ShopContext'
import { IUser } from '../../../pages/User/IUser'
import BASE_URL from '../../../config'
import { Link } from 'react-router-dom'

interface NavbarProps {
    isAuthenticated: boolean
    onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
    const [userData, setUserData] = useState<IUser>({
        userName: '',
        image: '',
        name: '',
        email: '',
        password: '',
        role: 0,
        createdAt: '',
    })
    const [isOpen, setIsOpen] = useState(false)
    const { getTotalCartItems } = useContext(ShopContext)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isAuthenticated) return

            try {
                const id = localStorage.getItem('id')
                const token = localStorage.getItem('token')

                if (!id || !token) {
                    throw new Error('User ID or token not found')
                }

                const response = await fetch(`${BASE_URL}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Failed to fetch user data')
                }

                const data = await response.json()
                setUserData(data)
            } catch (error) {
                console.error('Fetch user data error:', error)
            }
        }

        fetchUserData()
    }, [isAuthenticated])

    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //             setIsDropdownVisible(false)
    //         }
    //     }

    //     document.addEventListener('mousedown', handleClickOutside)
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside)
    //     }
    // }, [])

    useEffect(() => {
        setIsDropdownVisible(false)
    }, [isAuthenticated])

    const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible)
    const closeDropdown = () => setIsDropdownVisible(false)

    return (
        <nav className="bg-primaryLightGreen dark:bg-primaryDarkGreen">
            {/* Desktop Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden sm:flex justify-between h-16">
                <div className="flex items-center space-x-4">
                    <a href="/" className="text-black dark:text-white hover:text-primaryLightGreen">
                        Hem
                    </a>
                    <a
                        href="/garden"
                        className="text-black dark:text-white hover:text-primaryLightGreen"
                    >
                        Handelsträdgård
                    </a>
                    <a
                        href="/cafe"
                        className="text-black dark:text-white hover:text-primaryLightGreen"
                    >
                        Café
                    </a>
                    <a
                        href="/book"
                        className="text-black dark:text-white hover:text-primaryLightGreen"
                    >
                        Bokhandel
                    </a>
                </div>

                <div className="flex items-center justify-center">
                    <a href="/" className="text-white font-bold text-xl flex items-center">
                        MJs
                        <img className="h-12 w-12 ml-2" src={icon} alt="icon" />
                        <span className="ml-2">FlowerPot</span>
                    </a>
                </div>

                <div className="flex items-center space-x-4">
                    <a href="/kundkorg" className="relative">
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            size="xl"
                            className="text-black dark:text-white"
                        />
                        <span className="relative px-2 w-5 h-5 rounded-full bg-secondaryLightBrown dark:bg-secondaryDarkBrown text-black dark:text-white medium-14 -top-2">
                            {getTotalCartItems()}
                        </span>
                    </a>

                    <div ref={dropdownRef} className="relative">
                        {isAuthenticated ? (
                            <>
                                {userData.image ? (
                                    <img
                                        src={`${BASE_URL}/uploads/${userData.image}`}
                                        alt={userData.name || 'Användarbild'}
                                        onClick={toggleDropdown}
                                        className="rounded-full w-[35px] h-[35px] cursor-pointer"
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faUserTie}
                                        className="h-[35px] w-[35px] text-black dark:text-white cursor-pointer"
                                        onClick={toggleDropdown}
                                    />
                                )}

                                {isDropdownVisible && (
                                    <div className="absolute right-0 mt-2 w-48 bg-primaryLightGreen shadow-lg rounded-md dark:bg-primaryDarkGreen ">
                                        <ul className="py-2">
                                            <li>
                                                <Link
                                                    to="/minsida"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-black dark:text-white hover:bg-secondaryLightBrown dark:hover:bg-thirdDarkBlue"
                                                >
                                                    Min sida
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={onLogout}
                                                    className="block w-full text-left px-4 py-2 text-black dark:text-white hover:bg-secondaryLightBrown dark:hover:bg-thirdDarkBlue"
                                                >
                                                    Logga ut
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="text-black dark:text-white hover:text-primaryLightGreen"
                            >
                                <p>Logga in</p>
                            </Link>
                        )}
                    </div>
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
                    <a href="/kundkorg" className="relative pr-2">
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            size="xl"
                            className="text-black dark:text-white"
                        />
                        <span className="relative px-2 w-5 h-5 rounded-full bg-secondaryLightBrown dark:bg-secondaryDarkBrown text-black dark:text-white medium-14 -top-2">
                            {getTotalCartItems()}
                        </span>
                    </a>

                    <div ref={dropdownRef} className="relative">
                        {isAuthenticated ? (
                            <>
                                {userData.image ? (
                                    <img
                                        src={`${BASE_URL}/uploads/${userData.image}`}
                                        alt={userData.name || 'Användarbild'}
                                        onClick={toggleDropdown}
                                        className="rounded-full w-[35px] h-[35px] cursor-pointer"
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faUserTie}
                                        className="h-[35px] w-[35px] text-black cursor-pointer dark:text-white"
                                        onClick={toggleDropdown}
                                    />
                                )}

                                {isDropdownVisible && (
                                    <div className="absolute right-0 mt-2 w-48 bg-primaryLightGreen shadow-lg rounded-md dark:bg-primaryDarkGreen">
                                        <ul className="py-2">
                                            <li>
                                                <Link
                                                    to="/minsida"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-black dark:text-white"
                                                >
                                                    Min sida
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={onLogout}
                                                    className="block w-full text-left px-4 py-2 text-black dark:text-white"
                                                >
                                                    Logga ut
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="text-black dark:text-white hover:text-primaryLightGreen"
                            >
                                <p>Logga in</p>
                            </Link>
                        )}
                    </div>
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
                        href="/#"
                        className="block px-4 py-2 text-black dark:text-white hover:bg-green-700"
                    >
                        Om MJs
                    </a>
                    <a
                        href="/#"
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
