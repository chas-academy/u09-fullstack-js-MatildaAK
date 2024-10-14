import { useContext, useEffect } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
// import { useNavigate } from 'react-router-dom'
import Button from '../Button/Button'

const CartItems = () => {
    const { getTotalCartAmount, all_products, cartItems, addToCart, removeFromCart } =
        useContext(ShopContext)
    // const navigate = useNavigate()

    const handleQuantityChange = (e: any, productId: number) => {
        const newQuantity = parseInt(e.target.value, 10)

        if (newQuantity > 0) {
            addToCart(productId, newQuantity)
        } else {
            addToCart(productId, 0)
        }
    }

    useEffect(() => {
        const isCartEmpty = Object.values(cartItems).every((qty) => qty === 0)
        if (isCartEmpty) {
            // navigate('/')
         <p className='text-white'>Kundkorg är tom</p>
        }
    }, [cartItems])

    return (
        <section className="h-screen">
            <div className="text-black dark:text-white">
                {all_products.map((product) => {
                    if (cartItems[product.id] > 0) {
                        return (
                            <div key={product.id}>
                                <div className="border-y-2 border-black dark:border-white">
                                    <div className="flex flex-row py-4 px-6">
                                        <div className="basis-1/2">
                                            <div className="flex flex-row">
                                                <img src={`data:image/jpeg;base64,${product.image}`} height={60} width={43} alt={product.title} />
                                                <div className="flex flex-col pl-4">
                                                    <div>{product.title}</div>
                                                    {product.category === 'book' && (
                                                        <p className="py-2">{product.author}</p>
                                                    )}
                                                    {product.category === 'garden' && (
                                                        <p className="py-2">{product.sort}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="basis-1/2">
                                            <div className="flex flex-row justify-end items-center">
                                                <select
                                                    value={cartItems[product.id] || 1}
                                                    onChange={(event) =>
                                                        handleQuantityChange(event, product.id)
                                                    }
                                                    className="mr-4 border-2 bg-black rounded text-white px-6 py-2"
                                                >
                                                    {[...Array(19).keys()].map((num) => (
                                                        <option key={num} value={num}>
                                                            {num}
                                                        </option>
                                                    ))}
                                                </select>
                                                {/* <p>{cartItems[e.id]}</p> */}
                                                <div className="pl-4">
                                                    <FontAwesomeIcon
                                                        icon={faXmark}
                                                        onClick={() => removeFromCart(product.id)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {cartItems[product.id] > 1 ? (
                                            <>
                                                <p className="text-end font-thin">
                                                    ({product.price}:-/st)
                                                </p>
                                                <p className="text-end font-bold">
                                                    {product.price * cartItems[product.id]}:-
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-end font-bold">{product.price}:-</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    return null
                })}
            </div>
            
            <div className="text-black dark:text-white border-t-4 border-black dark:border-white mt-96 flex flex-row">
                <div className='basis-1/2 py-12'>
                <h4 className='font-bold text-lg'>Totalt</h4>
                </div>
              
              <div className='basis-1/2'>
              <h4 className='text-end text-lg font-extrabold py-12'>{getTotalCartAmount()}:-</h4>
              </div>
                

            </div>
            <div className="flex justify-center">
                <Button type="button" variant="primary" size="small">
                    Till kassan
                </Button>
            </div>
        </section>
    )
}

export default CartItems
