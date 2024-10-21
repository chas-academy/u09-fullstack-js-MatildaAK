import { useEffect, useState } from 'react';
import Item from '../PopularItems/Item';
import BASE_URL from '../../../config';

type Product = {
  id: number;
  category: string;
  title: string;
  image: string;
  price: number;
  author?: string;
  sort?: string;
};

const NewCollections: React.FC = () => {
  const [new_collection, setNew_collection] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/nyheter`);
        
        if (!response.ok) {
          throw new Error("Något gick fel vid hämtning av produkterna");
        }

        const data = await response.json();
        setNew_collection(data.products || []);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchProducts();
  }, []); 

  if (isLoading) {
    return <p>Laddar produkter...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>; 
  }

  return (
    <section>
      <div>
        <h3 className="text-black dark:text-white text-center">Nyheter</h3>
        <hr />
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {new_collection.length > 0 ? (
            new_collection.map((item) => (
              <div
                key={item.id}
                className="bg-primaryLightGreen dark:bg-primaryDarkGreen mx-6 my-3"
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
            <p className="text-black dark:text-white text-center">
              Inga produkter hittades
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewCollections;
