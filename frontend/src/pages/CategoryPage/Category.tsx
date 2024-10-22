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
    const [input] = useState('')

    const handleSearchResults = (results: Product[]) => {
        setSearchResults(results)
        setSearchPerformed(true)
    }

    console.log('Mottagen kategori:', category)
    console.log('Alla produkter:', all_products)

    const filteredProducts = all_products.filter((item) => {
        const productCategory = item._doc?.category || item.category
        return productCategory === category
    })
    console.log('Filtrerade produkter:', filteredProducts)

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
                {searchPerformed ? (
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
                        input && (
                            <p className="text-black dark:text-white text-center">
                                Inga produkter hittades
                            </p>
                        )
                    )
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((item) => {
                        const doc = item._doc || item
                        return (
                            <div
                                key={item.id}
                                className="border p-4 rounded-lg bg-primaryLightGreen dark:bg-primaryDarkGreen mx-6 my-3"
                            >
                                <Item
                                    id={item.id}
                                    image={doc.image}
                                    title={doc.title}
                                    author={doc.category === 'book' ? doc.author : undefined}
                                    sort={doc.category === 'garden' ? doc.sort : undefined}
                                    price={doc.price}
                                    category={doc.category}
                                />
                            </div>
                        )
                    })
                ) : (
                    <p className="text-black dark:text-white text-center">
                        Inga produkter i denna kategori
                    </p>
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
