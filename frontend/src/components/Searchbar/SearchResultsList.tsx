import { Link } from 'react-router-dom'
import { Product } from './Searchbar'

const SearchResultsList: React.FC<{
    products: Product[]
    searchPerformed: boolean
    searchTerm: string
}> = ({ products, searchPerformed, searchTerm }) => {
    return (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {products.length > 0
                ? products.map((product) => (
                      <div key={product.id} className="mb-4 text-center">
                          <Link to={`/${product.category}/${product.id}`}>
                              <div className="p-4 rounded-lg bg-primaryLightGreen dark:bg-primaryDarkGreen mx-6 my-3 text-black dark:text-white">
                                  <div className="flex justify-center">
                                      <img
                                          src={product.image}
                                          alt={product.title}
                                          className="w-16 h-16"
                                      />
                                  </div>

                                  <h3>{product.title}</h3>

                                  {product.category === 'book' && product.author && (
                                      <p>{product.author}</p>
                                  )}
                                  {product.category === 'garden' && product.sort && (
                                      <p>{product.sort}</p>
                                  )}

                                  <p>{product.price} kr</p>
                              </div>
                          </Link>
                      </div>
                  ))
                : searchPerformed &&
                  searchTerm && (
                      <div className="text-black dark:text-white">Inga produkter hittades</div>
                  )}
        </div>
    )
}

export default SearchResultsList
