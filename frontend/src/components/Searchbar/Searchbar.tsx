import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import SearchResultsList from './SearchResultsList'

export type Product = {
    id: number
    category: string
    title: string
    image: string
    price: number
    author?: string
    sort?: string
}

interface SearchbarProps {
    onSearch: (products: Product[]) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ onSearch }) => {
    const [input, setInput] = useState('')
    const { all_products } = useContext(ShopContext)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [searchPerformed, setSearchPerformed] = useState(false)

    const filterProducts = (searchTerm: string) => {
        setSearchPerformed(true)

        if (!searchTerm) {
            setSearchPerformed(false);
            onSearch([]); 
            return
        }

        const filtered = all_products.filter((product) => {
            const lowerCaseTerm = searchTerm.toLowerCase()

            const titleMatches = product.title.toLowerCase().includes(lowerCaseTerm)
            const authorMatches = product.author?.toLowerCase().includes(lowerCaseTerm) || false
            const sortMatches = product.sort?.toLowerCase().includes(lowerCaseTerm) || false

            return titleMatches || authorMatches || sortMatches
        })

        setFilteredProducts(filtered)
        setSearchPerformed(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInput(value)
        filterProducts(value)
    }

    return (
        <div>
            <div className="text-black bg-white dark:text-white dark:bg-thirdDarkBlue b-2 h-[3rem] flex items-center rounded-lg">
                
                <div className='w-[80%]'>
                <input
                    type="text"
                    placeholder="Sök efter titel, författare eller sort"
                    className="text-sm font-medium ml-2 focus:outline-none text-black bg-white dark:text-white dark:bg-thirdDarkBlue w-full"
                    value={input}
                    onChange={handleChange}
                />
                    </div>
                <div className='flex justify-center w-[20%]'>
                <FontAwesomeIcon icon={faMagnifyingGlass} className="mx-2" />
                </div>
            </div>
            <SearchResultsList products={filteredProducts} searchPerformed={searchPerformed} searchTerm={input} />
        </div>
    )
}

export default Searchbar
