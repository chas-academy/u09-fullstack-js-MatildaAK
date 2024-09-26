import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductHd = (props: { product: any; }) => {

    const {product} = props;

  return (
    <div className="flex items-center flex-wrap gap-x-2 medium-16 my-4 capitalize">
        Hem <FontAwesomeIcon icon={faAngleRight} /> 
        Handla <FontAwesomeIcon icon={faAngleRight} /> {
        product.category} <FontAwesomeIcon icon={faAngleRight} />
        {product.title}
    </div>
  )
}

export default ProductHd