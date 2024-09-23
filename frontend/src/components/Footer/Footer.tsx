import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
    return (
        <footer className='bg-primaryLightGreen dark:bg-primaryDarkGreen'>
            <div className="text-black dark:text-white font-sans flex justify-center">
                <div className="flex justify-between gap-x-10 py-4 md:gap-x-20">
                    <a href="#" className='hover:text-thirdDarkBlue dark:hover:text-thirdLightBlue'>FAQ</a>
                    <a href="#" className='hover:text-thirdDarkBlue dark:hover:text-thirdLightBlue'>MJs</a>
                    <a href="#" className='md:cursor-pointer hover:text-thirdDarkBlue dark:hover:text-thirdLightBlue'>
                    <FontAwesomeIcon icon={faSquareFacebook} size="xl" />
                    </a>
                    <a href="#" className='md:cursor-pointer hover:text-thirdDarkBlue dark:hover:text-thirdLightBlue'>
                        <FontAwesomeIcon icon={faInstagram} size="xl" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
