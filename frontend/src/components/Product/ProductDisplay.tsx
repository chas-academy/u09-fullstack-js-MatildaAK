import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import product_rt_1 from "../../assets/images/product_rt_1.png";
import product_rt_2 from "../../assets/images/product_rt_2.png";
import product_rt_3 from "../../assets/images/product_rt_3.png";
import product_rt_4 from "../../assets/images/product_rt_4.png";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ProductDisplay = (props: { product: any; }) => {

    const {product} = props;

  return (
    <section>
        <div className="flex flex-col gap-14 xl:flex-row text-black dark:text-white">
            <div className="flex gap-x-2">
                <div className="flex flex-col gap-[7px] flex-wrap">
                    <img src={product_rt_1} alt="productImg" className="max-h-[99px]"/>
                    <img src={product_rt_2} alt="productImg" className="max-h-[99px]"/>
                    <img src={product_rt_3} alt="productImg" className="max-h-[99px]"/>
                    <img src={product_rt_4} alt="productImg" className="max-h-[99px]"/>
                </div>
                <div>
                    <img src={product.image} alt="" className="h-[250px]" />
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
                <button>Lägg till i kundvagn</button>
            </div>
        </div>
    </section>
  )
}

export default ProductDisplay