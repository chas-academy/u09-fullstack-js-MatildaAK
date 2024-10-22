import React, { useEffect, useState } from "react";
import CategorySelect from "./CategorySelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import UpdateProductModal from "../UpdateProduct/UpdateProduct";
import { useAuth } from "../../Auth/Auth";
import BASE_URL from "../../../config";
import { IProductData } from "./IProductData";

interface IProduct {
  _doc: IProductData;
  image: string;
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
        const response = await fetch(`${BASE_URL}/produkter`);
        if (!response.ok) {
          throw new Error("Något gick fel vid hämtning av produkterna");
        }
        const data = await response.json();
        setProducts(data.products);

        data.products.forEach((product: IProduct) => {
          console.log(`Bild-URL för produkt ${product._doc.id}: ${BASE_URL}/uploads/${product._doc.image}`);
        });

        console.log("Hämtade produkter:", data.products);

        const uniqueCategories = Array.from(new Set(data.products.map((product: IProduct) => product._doc.category)));
        console.log("Unika kategorier:", uniqueCategories);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
   
    const categories = Array.from(new Set(products.map((product) => product._doc.category)));

  const openModal = (product: IProduct) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdate = (updatedProduct: IProductData) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._doc.id === updatedProduct.id
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

  const filteredProducts = selectedCategory
    ? products.filter((product) => product._doc.category === selectedCategory)
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
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.status);

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._doc.id !== id)
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
    <div>
      <CategorySelect
        categories={categories}
        onCategoryChange={setSelectedCategory}
      />

      <ul className="text-black dark:text-white my-4 flex justify-start flex-col">
        {filteredProducts.map((product) => (
          <li key={product._doc.id}>
            <div>
              <div className="border-y-2 border-black dark:border-white">
                <div className="flex flex-row py-4 px-6">
                  <div className="basis-1/2">
                    <div className="flex flex-row">
                      <img
                        src={`${BASE_URL}/uploads/${product._doc.image}`}
                        alt={product._doc.title}
                        height={60}
                        width={43}
                      />
                      <div className="flex flex-col pl-4">
                        <div>{product._doc.title}</div>
                        {product._doc.category === "book" && (
                          <p className="py-2">{product._doc.author}</p>
                        )}
                        {product._doc.category === "garden" && (
                          <p className="py-2">{product._doc.sort}</p>
                        )}
                        <div>{product._doc.price}:-</div>
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
                          onClick={() => removeFromList(product._doc.id)}
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
          product={selectedProduct._doc}
        />
      )}
    </div>
  );
};

export default ProductList;

