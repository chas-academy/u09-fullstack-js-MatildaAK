// import Popular from "../../components/PopularItems/Popular";

import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Item from '../../components/PopularItems/Item'
import Button from '../../components/Button/Button'
import { useContext } from 'react'
import { ShopContext } from '../../Context/ShopContext'

type CategoryProps = {
    category: string
    banner: any
}

const Category: React.FC<CategoryProps> = ({ category, banner }) => {
    const { all_products } = useContext(ShopContext)

    console.log(all_products)

    return (
        <section>
            <div>
                <img
                    src={banner}
                    alt="Banner bild"
                    className="h-[250px] md:h-[400px] w-full object-cover"
                />
            </div>
            <div className="text-black dark:text-white">
                {/* <h5>Visar 1-12 <span> av 36 produkter</span></h5> */}
                <div>
                    Filter <FontAwesomeIcon icon={faChevronDown} />{' '}
                </div>
            </div>
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {Array.isArray(all_products) && all_products.length > 0 ? (
                    all_products.filter((item) => item.category === category).length > 0 ? (
                        all_products.map((item) => {
                            if (category === item.category) {
                                return (
                                    <div
                                        key={item.id}
                                        className="bg-primaryLightGreen dark:bg-primaryDarkGreen mx-6 my-3"
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
                        <p className='text-black dark:text-white text-center'>Inga produkter i denna kategori</p> // Meddelande när kategorin är tom
                    )
                ) : (
                    <p>Laddar produkter...</p> // Laddningsindikator om produkter inte har laddats än
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
