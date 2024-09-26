// import Popular from "../../components/PopularItems/Popular";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import all_products from "../../assets/all_products"
import Item from "../../components/PopularItems/Item"
import Button from "../../components/Button/Button"

type CategoryProps = {
  category: string,
  banner: any
}

const Category: React.FC<CategoryProps> = ({category, banner}) => {
  return (
    <section>
      <div>
        <img src={banner} alt="Banner bild" className="h-[250px] md:h-[320px] w-full object-cover" />
      </div>
      <div className="text-black dark:text-white">
        {/* <h5>Visar 1-12 <span> av 36 produkter</span></h5> */}
        <div>Filter <FontAwesomeIcon icon={faChevronDown} /> </div>
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {all_products.map((item) => {
          if (category === item.category) {
            return <Item
              key={item.id}
              id={item.id}
              image={item.image}
              title={item.title}
              author={item.category === 'book' ? item.author : undefined}
              sort={item.category === 'garden' ? item.sort : undefined}
              price={item.price} 
              category={item.category} />
          }
        })}
      </div>
      <div className="my-10 text-center text-black dark:text-white">
        <Button type="button" variant="third" size="small">Ladda fler produkter</Button>
      </div>
    </section>
  )
}

export default Category