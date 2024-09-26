import { createContext, ReactNode } from "react";
import all_products from "../assets/all_products";

type Product = {
  id: number;
  category: string;
  title: string;
  image: string;
  price: number;
  author?: string;
  sort?: string;
};

interface ShopContextProviderProps {
  children: ReactNode;
}

interface ShopContextType {
  all_products: Product[];
}

export const ShopContext = createContext<ShopContextType>({all_products: [],});

const ShopContextProvider: React.FC<ShopContextProviderProps> = (props) => {
  const contextValue = { all_products };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
