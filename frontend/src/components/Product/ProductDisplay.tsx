import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import BASE_URL from "../../config";



const ProductDisplay = (props: { product: any; }) => {

    const {product} = props;
    const {addToCart} = useContext(ShopContext);

    const handleAddToCart = () => {
        const productId = product.id;
        const objectId = product._id.toString();
        addToCart(productId, objectId);
        console.log(productId);
    };

  return (
    <section>
        <div className="flex flex-col gap-14 xl:flex-row text-black dark:text-white">
            <div className="flex gap-x-2">
                <div className="ml-10">
                <img src={`${BASE_URL}/uploads/${product.image}`} height={200} width={200} alt={product.title} />
                </div>
            </div>
            <div>
                <h3>{product.title}</h3>
                {product.category === 'book' && <p>{product.author}</p>}
                {product.category === 'garden' && <p>{product.sort}</p>}
                <div className="flex gap-x-2 text-white">
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <p>(111)</p>
                </div>
                <div>
                    <div>{product.price} kr</div>
                </div>
                <button onClick={handleAddToCart}>Lägg till i kundvagn</button>
            </div>
        </div>
    </section>
  )
}

export default ProductDisplay