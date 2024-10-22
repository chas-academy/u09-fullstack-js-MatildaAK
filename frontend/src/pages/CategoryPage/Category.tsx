import Item from '../../components/Product/PopularItems/Item'
import Button from '../../components/Button/Button'
import { useContext, useState } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import Searchbar, { Product } from '../../components/Searchbar/Searchbar'

type CategoryProps = {
    category: string
    banner: any
}

const Category: React.FC<CategoryProps> = ({ category, banner }) => {
    const { all_products } = useContext(ShopContext)
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [searchPerformed, setSearchPerformed] = useState(false)
    const [input] = useState('');

    const handleSearchResults = (results: Product[]) => {
        setSearchResults(results)
        setSearchPerformed(true)
    }

    return (
        <section>
            <div>
                <img
                    src={banner}
                    alt="Banner bild"
                    className="h-[250px] md:h-[400px] w-full object-cover"
                />
            </div>
            <div className="flex justify-center items-center pt-[2vh] flex-col">
                <div className="">
                    <Searchbar onSearch={handleSearchResults} />
                </div>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {searchPerformed ? ( // Kolla om en sökning har utförts
                    searchResults.length > 0 ? (
                        searchResults.map((item) => (
                            <div
                                key={item.id}
                                className="border p-4 rounded-lg bg-primaryLightGreen dark:bg-primaryDarkGreen mx-6 my-3"
                            >
                                <Item
                                    id={item.id}
                                    image={item.image}
                                    title={item.title}
                                    author={item.category === 'book' ? item.author : undefined}
                                    sort={item.category === 'garden' ? item.sort : undefined}
                                    price={item.price}
                                    category={item.category}
                                />
                            </div>
                        ))
                    ) : (
                       input && <p className="text-black dark:text-white text-center">
                            Inga produkter hittades
                        </p>
                    )
                ) : Array.isArray(all_products) && all_products.length > 0 ? (
                    all_products.filter((item) => item.category === category).length > 0 ? (
                        all_products.map((item) => {
                            if (category === item.category) {
                                return (
                                    <div
                                        key={item.id}
                                        className="border p-4 rounded-lg bg-primaryLightGreen dark:bg-primaryDarkGreen mx-6 my-3"
                                    >
                                        <Item
                                            id={item.id}
                                            image={item.image}
                                            title={item.title}
                                            author={
                                                item.category === 'book' ? item.author : undefined
                                            }
                                            sort={
                                                item.category === 'garden' ? item.sort : undefined
                                            }
                                            price={item.price}
                                            category={item.category}
                                        />
                                    </div>
                                )
                            }
                            return null
                        })
                    ) : (
                        <p className="text-black dark:text-white text-center">
                            Inga produkter i denna kategori
                        </p>
                    )
                ) : (
                    <p>Laddar produkter...</p>
                )}
            </div>
            <div className="my-10 text-center text-black dark:text-white">
                <Button type="button" variant="third" size="small">
                    Ladda fler produkter
                </Button>
            </div>
        </section>
    )
}

export default Category
