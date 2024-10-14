import { createContext, ReactNode, useEffect, useState } from 'react'
import BASE_URL from '../config'
import { useAuth } from '../components/Auth/Auth'

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
        return storedCart ? JSON.parse(storedCart) : {}
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
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await fetch(`${BASE_URL}/produkter`)
                if (!response.ok) {
                    throw new Error('Något gick fel vid hämtning av produkterna')
                }
                const data = await response.json()
                setAll_products(data.products || []);

                if(token) {
                    fetch(`${BASE_URL}/kundkorg`, {
                        method: "POST",
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body:"",
                    }) .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Error: ${response.statusText}`)
                        }
                        return response.json()
                    })
                    .then((data) => {
                        if (!data.success) {
                            console.log('Hittade inte kundkorg')
                        } else {
                            console.log("Kundkorg")
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error.message)
                    })
                }
            } catch (error: any) {
                console.error('Error fetching products:', error)
            }
        }

        fetchProducts()
    }, [])

    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isAuthenticated]);

    const addToCart = (itemId: number, quantity: number) => {
        setCartItems((prev: { [key: number]: number }) => ({
            ...prev,
            [itemId]: quantity,
        }))

        const token = localStorage.getItem('token')
        if (token) {
            fetch(`${BASE_URL}/addkundkorg`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId, quantity: quantity }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`)
                    }
                    return response.json()
                })
                .then((data) => {
                    if (!data.success) {
                        console.log('Misslyckades att lägga till')
                    } else {
                        console.log('Tilldagd')
                    }
                })
                .catch((error) => {
                    console.error('Error:', error.message)
                })
        } else {
            console.error('Ingen token hittades i localStorage.')
        }
    }

    const removeFromCart = (itemId: number) => {
        setCartItems((prev: any) => {
            const updatedCart = { ...prev }
            delete updatedCart[itemId]
            return updatedCart
        })

        const token = localStorage.getItem('token')
        if (token) {
            fetch(`${BASE_URL}/subkundkorg`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId: itemId }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`)
                    }
                    return response.json()
                })
                .then((data) => {
                    if (!data.success) {
                        console.log('Misslyckades att tabort produkt')
                    } else {
                        console.log('Borttagen')
                    }
                })
                .catch((error) => {
                    console.error('Error:', error.message)
                })
        } else {
            console.error('Ingen token hittades i localStorage.')
        }
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
