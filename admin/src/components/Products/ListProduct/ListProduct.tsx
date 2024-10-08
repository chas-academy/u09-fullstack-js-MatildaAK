import React, { useEffect, useState } from "react";
import CategorySelect from "./CategorySelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import UpdateProductModal from "../UpdateProduct/UpdateProduct";
import { useAuth } from "../../Auth/Auth";

interface IProduct {
  id: number;
  title: string;
  author?: string;
  category: string;
  image: string;
  sort?: string;
  description: string;
  price: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const { isAuthenticated } = useAuth();
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/produkter");
        if (!response.ok) {
          throw new Error("Något gick fel vid hämtning av produkterna");
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openModal = (product: IProduct) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdate = (updatedProduct: IProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id
          ? { ...product, ...updatedProduct }
          : product
      )
    );
    closeModal();
  };

  if (loading) {
    return <div>Laddar produkter...</div>;
  }

  if (error) {
    return <div>Fel: {error}</div>;
  }

  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const removeFromList = async (id: number) => {
    const confirmed = window.confirm(
      "Är du säker på att du vill radera produkten?"
    );
    if (!confirmed) {
      return;
    }

    if (!isAuthenticated) {
      alert("Du måste vara inloggad för att ta bort en produkt.");
      return;
    }

    try {
      //   const id = localStorage.getItem("id");
      const { token } = useAuth();
      //   if (!id || !token) {
      //     throw new Error("User ID or token not found in local storage");
      //   }

      const response = await fetch(`http://localhost:4000/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.status);

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );

        window.alert("Produkten har blivit borttaget.");

        localStorage.removeItem("id");
        localStorage.removeItem("token");
      } else {
        throw new Error("Lyckades inte radera produkt");
      }
    } catch (error) {
      console.error("Update user data error:", error);
    }
  };

  return (
    <div className="product-list">
      <CategorySelect
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />

      <ul className="product-list text-black dark:text-white my-4 flex justify-start flex-col">
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <div>
              <div className="border-y-2 border-black dark:border-white">
                <div className="flex flex-row py-4 px-6">
                  <div className="basis-1/2">
                    <div className="flex flex-row">
                      <img
                        src={`data:image/jpeg;base64,${product.image}`}
                        alt={product.title}
                        height={60}
                        width={43}
                      />
                      <div className="flex flex-col pl-4">
                        <div>{product.title}</div>
                        {product.category === "book" && (
                          <p className="py-2">{product.author}</p>
                        )}
                        {product.category === "garden" && (
                          <p className="py-2">{product.sort}</p>
                        )}
                        <div>{product.price}:-</div>
                      </div>
                    </div>
                  </div>
                  <div className="basis-1/2">
                    <div className="flex flex-row justify-end gap-x-4">
                      <div
                        onClick={() => openModal(product)}
                        className="cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </div>
                      <div className="pl-4 text-error cursor-pointer">
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          onClick={() => removeFromList(product.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedProduct && (
        <UpdateProductModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onUpdate={handleUpdate}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default ProductList;
