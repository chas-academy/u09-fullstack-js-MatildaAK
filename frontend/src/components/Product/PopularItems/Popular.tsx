import { useEffect, useState } from 'react'
import Item from './Item'
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

const Popular = () => {
    const [popularProducts, setpopularProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch(`${BASE_URL}/popularaprodukter`);
          
          if (!response.ok) {
            throw new Error("Något gick fel vid hämtning av produkterna");
          }
  
          const data = await response.json();
          setpopularProducts(data.products || []);
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
                <h3>Populära produkter</h3>
                <hr />
                {/* container */}
                <div className='grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
                    {popularProducts.map((item) => {
                        return (
                            <Item
                                key={item.id}
                                id={item.id}
                                image={item.image}
                                title={item.title}
                                author={item.author}
                                price={item.price} 
                                category={''}                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Popular
