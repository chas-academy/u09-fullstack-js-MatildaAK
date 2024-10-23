import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../Button/Button'
import { loadStripe } from '@stripe/stripe-js'
import BASE_URL from '../../config'

const stripePromise = loadStripe("pk_test_51NTMqiL9OmzOvV9CqzwunrchIVeekQkjPGD237BBbSB9pww9QiWVTypjglHzpdiMY5SZIv6GRCznN5WIlgbiQ0UX00XTpxVgDl")

const CartItems = () => {
    const {
        getTotalCartAmount,
        all_products,
        cartItems,
        updateCartQuantity,
        removeFromCart,
        loading,
    } = useContext(ShopContext)
    const [canceled, setCanceled] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const items = Array.isArray(cartItems) ? cartItems : []

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        if (queryParams.get('canceled')) {
            setCanceled(true)
        }
    }, [location])

    const isDataReady = !loading && all_products.length > 0

    if (loading) {
        return (
            <div className="text-black dark:text-white text-center mt-16">Laddar kundvagnen...</div>
        )
    }

    const getCartItemQuantity = (productId: number) => {
        const cartItem = items.find((item) => item.id === productId)
        return cartItem ? cartItem.quantity : 0
    }

    const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>, productId: string) => {
        const newQuantity = parseInt(e.target.value, 10)
        if (newQuantity > 0) {
            updateCartQuantity(productId, newQuantity)
        } else {
            removeFromCart(productId)
        }
    }

    const handlePayment = async () => {
        const stripe = await stripePromise

        if (!stripe) {
            console.error('Stripe not loaded')
            return
        }

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${BASE_URL}/betalning/create-checkout-session`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    products: items,
                }),
            })

            if (!res.ok) {
                throw new Error('Error creating checkout session')
            }

            const session = await res.json()

            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            })

            if (result.error) {
                console.error('Error:', result.error.message)
            }
        } catch (error) {
            console.error('Error handling payment:', error)
        }
    }

    // const isCartEmpty = items.length === 0 || items.every((item) => item.quantity === 0)
    const isCartEmpty = cartItems.length === 0 || cartItems.every((item) => item.quantity === 0)

    if (isDataReady && isCartEmpty) {
        return (
            <div className="text-center py-20 text-black dark:text-white">
                <h2 className="text-2xl font-bold">Kundkorgen är tom</h2>
                <p className="my-4">Lägg till några produkter för att se dem här.</p>
                <Button type="button" variant="primary" size="small" onClick={() => navigate('/')}>
                    Tillbaka till butiken
                </Button>
            </div>
        )
    }

    return (
        <section>
            <div className="text-black dark:text-white">
                {all_products.map((product) => {
                    const productData = product._doc ? product._doc : product
                    const quantity = getCartItemQuantity(productData.id)

                    {
                        canceled && (
                            <p style={{ color: 'red' }}>
                                Ditt köp avbröts. Vänligen kontrollera din kundvagn.
                            </p>
                        )
                    }

                    if (quantity > 0) {
                        return (
                            <div key={productData.id}>
                                <div className="border-y-2 border-black dark:border-white">
                                    <div className="flex flex-row py-4 px-6">
                                        <div className="basis-1/2">
                                            <div className="flex flex-row">
                                                <img
                                                    src={`${BASE_URL}/uploads/${productData.image}`}
                                                    height={60}
                                                    width={43}
                                                    alt={productData.title}
                                                />
                                                <div className="flex flex-col pl-4">
                                                    <div>{productData.title}</div>
                                                    {productData.category === 'book' && (
                                                        <p className="py-2">{productData.author}</p>
                                                    )}
                                                    {productData.category === 'garden' && (
                                                        <p className="py-2">{productData.sort}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="basis-1/2">
                                            <div className="flex flex-row justify-end items-center">
                                                <select
                                                    value={quantity}
                                                    onChange={(event) =>
                                                        handleQuantityChange(
                                                            event,
                                                            productData._id.toString()
                                                        )
                                                    }
                                                    className="mr-4 border-2 bg-black rounded text-white px-6 py-2"
                                                >
                                                    {[...Array(19).keys()].map((num) => (
                                                        <option key={num} value={num}>
                                                            {num}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pl-4">
                                                    <FontAwesomeIcon
                                                        icon={faXmark}
                                                        onClick={() =>
                                                            removeFromCart(
                                                                productData._id.toString()
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {quantity > 1 ? (
                                            <>
                                                <p className="text-end font-thin">
                                                    ({productData.price}:-/st)
                                                </p>
                                                <p className="text-end font-bold">
                                                    {productData.price * quantity}:-
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-end font-bold">
                                                {productData.price}:-
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    return null
                })}
            </div>

            {!isCartEmpty && (
                <div>
                    <div className="text-black dark:text-white border-t-4 border-black dark:border-white mt-96 flex flex-row">
                        <div className="basis-1/2 py-12">
                            <h4 className="font-bold text-lg">Totalt</h4>
                        </div>

                        <div className="basis-1/2">
                            <h4 className="text-end text-lg font-extrabold py-12">
                                {getTotalCartAmount()}:-
                            </h4>
                        </div>
                    </div>
                    <div className="flex justify-center mb-10">
                        <Button
                            type="button"
                            variant="primary"
                            size="small"
                            onClick={handlePayment}
                        >
                            Till kassan
                        </Button>
                    </div>
                </div>
            )}
        </section>
    )
}

export default CartItems
