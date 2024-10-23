import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import BASE_URL from "../../config";
import Button from "../Button/Button";

const ProductDisplay = (props: { product: any; }) => {

    const {product} = props;
    const {addToCart} = useContext(ShopContext);

    const handleAddToCart = () => {

        if (!product) {
            console.error("Product is undefined", product);
            return <div>Produkten är inte tillgänglig</div>;
        }

        const productId = product.id;
        const objectId = product._id.toString();
        addToCart(productId, objectId);
    };

  return (
    <section>
        <div className="flex flex-col gap-8 xl:flex-row text-black dark:text-white">
            <div className="w-80 sm:w-1/2 flex justify-center">
            <div className="sm:ml-52">
                <div>
                <h3 className="text-xl font-semibold">{product.title}</h3>
                {product.category === 'book' && <p>Av {product.author}</p>}
                </div>
    
            </div>

            </div>

            <div className="flex justify-center gap-x-2 md:gap-x-8">
                <div className="ml-10">
                <img src={`${BASE_URL}/uploads/${product.image}`} alt={product.title}  className="w-[150px] h-[200px] sm:w-[200px] sm:h-[250px]" />
                </div>
                <div>
                <h3>{product.title}</h3>
                {product.category === 'book' && <p>{product.author}</p>}
                {product.category === 'garden' && <p>{product.sort}</p>}
                <div>
                    <div>{product.price} kr</div>
                </div>
            </div>
            </div>


            <div className="flex justify-center">
                <Button variant="secondary" onClick={handleAddToCart} type={"button"}>Lägg till i kundvagn</Button>
                </div>
                
        </div>
    </section>
  )
}

export default ProductDisplay