import { Link } from 'react-router-dom'
import { Product } from './Searchbar'
import BASE_URL from '../../config'

const SearchResultsList: React.FC<{
    products: Product[]
    searchPerformed: boolean
    searchTerm: string
}> = ({ products, searchPerformed, searchTerm }) => {
    
    return (
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {products.length > 0 ? (
          products.map((product) => {
            const doc = product._doc || product;
  
            return (
              <div key={doc.id} className="mb-4 text-center">
                <Link to={`/${doc.category}/${doc.id}`}>
                  <div className="p-4 rounded-lg bg-primaryLightGreen dark:bg-primaryDarkGreen mx-6 my-3 text-black dark:text-white">
                    <div className="flex justify-center">
                      <img
                        src={`${BASE_URL}/uploads/${doc.image}`}
                        alt={doc.title}
                        className="w-16 h-16"
                      />
                    </div>
  
                    <h3>{doc.title}</h3>
  
                    {doc.category === 'book' && doc.author && (
                      <p>{doc.author}</p>
                    )}
                    {doc.category === 'garden' && doc.sort && (
                      <p>{doc.sort}</p>
                    )}
  
                    <p>{doc.price} kr</p>
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          searchPerformed && searchTerm && (
            <div className="text-black dark:text-white">Inga produkter hittades</div>
          )
        )}
      </div>
    )
}

export default SearchResultsList
