import { createContext, ReactNode } from "react";
import all_product from "../assets/all_products";

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
  all_product: Product[];
}

export const ShopContext = createContext<ShopContextType | null>(null);

const ShopContextProvider: React.FC<ShopContextProviderProps> = (props) => {
  const contextValue = { all_product };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
