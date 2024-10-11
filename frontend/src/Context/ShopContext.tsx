import { createContext, ReactNode, useEffect, useState } from 'react'
import BASE_URL from '../config'

type Product = {
    id: number
    category: string
    title: string
    image: string
    price: number
    author?: string
    sort?: string
}

interface ShopContextProviderProps {
    children: ReactNode
}

interface ShopContextType {
    all_products: Product[]
    cartItems: { [key: number]: number }
    addToCart: (itemId: number, quantity: number) => void
    removeFromCart: (itemId: number) => void
    getTotalCartAmount: () => number
    getTotalCartItems: () => number
}

export const ShopContext = createContext<ShopContextType>({
    all_products: [],
    cartItems: {},
    addToCart: () => {},
    removeFromCart: () => {},
    getTotalCartAmount: () => 0,
    getTotalCartItems: () => 0,
})

const getDefaultCart = () => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
        return JSON.parse(storedCart)
    }
    let cart: { [key: number]: number } = {}
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0
    }
    return cart
}

const ShopContextProvider: React.FC<ShopContextProviderProps> = (props) => {
    const [cartItems, setCartItems] = useState(getDefaultCart())
    const [all_products, setAll_products] = useState<Product[]>([])

    useEffect(() => {
        fetch(`${BASE_URL}/produkter`)
            .then((respons) => respons.json())
            .then((data) => setAll_products(data))
    }, [])

    const addToCart = (itemId: number, quantity: number) => {
        setCartItems((prev: { [key: number]: number }) => ({
            ...prev,
            [itemId]: quantity,
        }))
    }

    const removeFromCart = (itemId: number) => {
        setCartItems((prev: any) => {
            const updatedCart = { ...prev }
            delete updatedCart[itemId]
            return updatedCart
        })
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_products.find((product: Product) => product.id === Number(item))
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item]
                }
            }
        }
        return totalAmount
    }

    const getTotalCartItems = () => {
        let totalItems = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItems += cartItems[item]
            }
        }
        return totalItems
    }

    const contextValue = {
        all_products,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
    }

    return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>
}

export default ShopContextProvider
