import { useContext } from "react"
import { ShopContext } from "../../Context/ShopContext"
import { useParams } from "react-router-dom";
import ProductHd from "../../components/Product/ProductHd";
import ProductDisplay from "../../components/Product/ProductDisplay";
import ProductDescription from "../../components/Product/ProductDescription";

const Product = () => {
  const {all_products} = useContext(ShopContext);

  if (!all_products) {
    return <div>ShopContext är inte tillgängligt</div>;
  }
  const {id} = useParams();
  const product = all_products.find((e: { id: number; }) => e.id === Number(id));
  if(!product){
    return <div>Hittade ingen produkt</div>
  }
  return (
    <section>
      <div>
        <ProductHd product={product} />
        <ProductDisplay product={product} />
        <ProductDescription />
      </div>
    </section>
  )
}

export default Product;