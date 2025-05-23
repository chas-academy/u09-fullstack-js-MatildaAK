import { Link } from 'react-router-dom'
import BASE_URL from '../../../config'

type ItemProps = {
    id: number
    category: string
    title: string
    image: string
    price: number
    author?: string
    sort?: string
}

const Item: React.FC<ItemProps> = ({ id, category, title, author, sort, image, price }) => {
    return (
        <Link to={`/${category}/${id}`}>
            <div className="mx-6 my-3">
                <div className="flex justify-center mt-4">
                    <img src={`${BASE_URL}/uploads/${image}`} height={80} width={60} alt={title} />
                </div>
                <div className="text-black dark:text-white font-sans p-2 text-center text-xs xs:text-base md:text-lg">
                    <h4 className="font-semibold">{title}</h4>
                    {category === 'book' && <p> {author}</p>}
                    {category === 'garden' && <p> {sort}</p>}
                    <div>
                        <div>{price} kr</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Item
