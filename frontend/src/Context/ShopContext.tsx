import { createContext, ReactNode, useEffect, useState } from 'react'
import BASE_URL from '../config'
import { useAuth } from '../components/Auth/Auth'
import { ObjectId } from 'mongoose'

type Product = {
    _id: ObjectId
    id: number
    category: string
    title: string
    image: string
    price: number
    author?: string
    sort?: string
    _doc?: {
        category: string
        [key: string]: any
    }
}

type CartItem = {
    id: number
    quantity: number
}

interface ShopContextProviderProps {
    children: ReactNode
}

interface ShopContextType {
    all_products: Product[]
    cartItems: CartItem[]
    addToCart: (productId: number, objectId: string) => void
    removeFromCart: (itemId: string) => void
    updateCartQuantity: (itemId: string, quantity: number) => void
    getTotalCartAmount: () => number
    getTotalCartItems: () => number
    clearCart: () => void
    loading: boolean
}

export const ShopContext = createContext<ShopContextType>({
    all_products: [],
    cartItems: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateCartQuantity: () => {},
    getTotalCartAmount: () => 0,
    getTotalCartItems: () => 0,
    clearCart: () => {},
    loading: false,
})

const getDefaultCart = () => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
        return storedCart ? JSON.parse(storedCart) : []
    }
    return []
}

const ShopContextProvider: React.FC<ShopContextProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(getDefaultCart())
    const [all_products, setAll_products] = useState<Product[]>([])
    const { isAuthenticated } = useAuth()
    const [loading, setLoading] = useState<boolean>(true)

    // Fetch products and user's cart
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${BASE_URL}/produkter`)
                if (!response.ok) throw new Error('Något gick fel vid hämtning av produkterna')
                const data = await response.json()
                setAll_products(data.products || [])
            } catch (error: any) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        const fetchCartItems = async () => {
            if (isAuthenticated) {
                const token = localStorage.getItem('token')
                try {
                    const response = await fetch(`${BASE_URL}/kundkorg/checkout`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    if (!response.ok) throw new Error('Något gick fel vid hämtning av kundvagnen')
                    const data = await response.json()
                    setCartItems(data)
                } catch (error: any) {
                    console.error('Error fetching cart items:', error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        fetchProducts()
        fetchCartItems()
    }, [isAuthenticated])

    // Add item to cart
    const addToCart = async (productId: number, objectId: string) => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const response = await fetch(`${BASE_URL}/kundkorg`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId: productId, objectId: objectId }),
                })
                if (!response.ok) throw new Error('Error adding product to cart')
                const updatedCartItems = await response.json()
                setCartItems(updatedCartItems)
            } catch (error: any) {
                console.error('Error adding to cart:', error.message)
            }
        }
    }

    // Remove item from cart
    const removeFromCart = async (objectId: string) => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                console.log('Removing product with ID:', objectId)
                const response = await fetch(`${BASE_URL}/kundkorg/remove`, {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ objectId: objectId }),
                })
                if (!response.ok) throw new Error('Error removing product from cart')
                const updatedCartItems = await response.json()
                setCartItems(updatedCartItems)
            } catch (error: any) {
                console.error('Error removing from cart:', error.message)
            }
        }
    }

    // Update quantity of cart item
    const updateCartQuantity = async (productId: string, quantity: number) => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const response = await fetch(`${BASE_URL}/kundkorg/${productId}`, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity }),
                })
                if (!response.ok) throw new Error('Error updating quantity')
                const updatedCartItems = await response.json()
                setCartItems(updatedCartItems)
            } catch (error: any) {
                console.error('Error updating cart quantity:', error.message)
            }
        }
    }

    // Clear cart
    const clearCart = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const response = await fetch(`${BASE_URL}/kundkorg/removeall`, {
                    method: 'DELETE',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) throw new Error('Error clearing cart')
                setCartItems([])
            } catch (error: any) {
                console.error('Error clearing cart:', error.message)
            }
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0

        cartItems.forEach((cartItem) => {
            const product = all_products.find((p) => p._doc?.id === Number(cartItem.id))

            if (product) {
                if (typeof product._doc?.price === 'number') {
                    const quantity = cartItem.quantity

                    if (typeof quantity === 'number') {
                        totalAmount += product._doc.price * quantity
                    } else {
                        console.warn(`Invalid quantity for cartItem with id: ${cartItem.id}`)
                    }
                }
            } else {
                console.warn(`Product not found for cartItem with id: ${cartItem.id}`)
            }
        })

        return totalAmount
    }

    const getTotalCartItems = () => {
        return (cartItems || []).reduce((total, item) => total + item.quantity, 0)
    }

    const contextValue = {
        all_products,
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getTotalCartAmount,
        getTotalCartItems,
        clearCart,
    }

    return <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
}

export default ShopContextProvider
