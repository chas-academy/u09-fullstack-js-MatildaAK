import { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import Item from '../PopularItems/Item';



interface RelatedProductsProps {
  category: string;
  currentProductId: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ category, currentProductId }) => {
  const { all_products } = useContext(ShopContext);

  if (!all_products) {
    return <div>Inga produkter tillgängliga</div>;
  }

  // Filtrera produkter baserat på samma kategori, men uteslut den aktuella produkten
  const relatedProducts = all_products.filter(
    (item) => item.category === category && item.id !== currentProductId
  );

  return (
    <section>
      <div>
        <h3 className="text-black dark:text-white">Du kanske gillar</h3>
        <hr />
        {/* container */}
        <div className='grid grid-cols-3 xs:grid-cols-4 md:grid-cols-5 xl:grid-cols-6'>
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <Item
                key={item.id}
                id={item.id}
                image={item.image}
                title={item.title}
                author={item.category === 'book' ? item.author : undefined}
                sort={item.category === 'garden' ? item.sort : undefined}
                price={item.price}
                category={item.category}
              />
            ))
          ) : (
            <p>Inga relaterade produkter</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
