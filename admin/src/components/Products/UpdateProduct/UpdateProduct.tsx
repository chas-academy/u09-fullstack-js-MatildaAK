import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../Auth/Auth";

interface UpdateProductModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onUpdate: (updatedProduct: IProductData) => void;
  product: IProductData;
}

interface IProductData {
  id: number;
  title: string;
  description: string;
  image: string;
  author?: string;
  sort?: string;
  price: number;
  category: string;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  isOpen,
  onRequestClose,
  onUpdate,
  product,
}) => {
  const [formData, setFormData] = useState<IProductData>({
    id: 0,
    title: "",
    description: "",
    image: "",
    author: "",
    sort: "",
    price: 0,
    category: "",
  });

  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

  Modal.setAppElement("#root");

  useEffect(() => {
    if (product && isOpen) {
      setFormData(product);
    }
  }, [product, isOpen]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = event.target;

    const input = event.target as HTMLInputElement;

    if (type === "file" && input.files) {
      const fileArray = Array.from(input.files);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: fileArray,
      }));
      setSelectedFileNames(fileArray.map((file) => file.name));
    } else if (name === "price") {
      const priceValue = value === "" ? 0 : parseFloat(value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: priceValue,
      }));
    } else {
      const value = event.target.value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    if (formData.title) {
      formDataToSend.append("title", formData.title);
    }

    if (formData.description) {
      formDataToSend.append("description", formData.description);
    }

    if (formData.author) {
      formDataToSend.append("author", formData.author);
    }

    if (formData.sort) {
      formDataToSend.append("sort", formData.sort);
    }

    if (formData.price !== undefined) {
      formDataToSend.append("price", formData.price.toString());
    }

    if (formData.category) {
      formDataToSend.append("category", formData.category);
    }

    if (formData.image && Array.isArray(formData.image)) {
      formData.image.forEach((image: File) => {
        formDataToSend.append("image", image);
      });
    }

    const token = localStorage.getItem("token");
    console.log("Hämtar Token:", token);

    try {
      const response = await fetch(`http://localhost:4000/${formData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Lyckades inte uppdatera produkt");
      }

      if (!isAuthenticated) {
      
        console.error("Användare inte authoriserad");
  
        return;
      }

      const updatedProduct = await response.json();
      onUpdate(updatedProduct);
      onRequestClose();
      window.alert("Produkt är uppdaterad.");
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <h2 className="text-center">Uppdatera produkt</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mt-4 border-4 border-primaryDarkGreen rounded-sm mx-16 py-4">
          <div>
            <div>
              <h4>Titel: </h4>
              <input
                type="text"
                name="title"
                className="text-black capitalize"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <h4>Pris: </h4>
              <input
                type="text"
                name="price"
                className="text-black"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <h4>Beskrivning: </h4>
              <textarea
                name="description"
                className="text-black"
                cols={23}
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex mt-4 gap-x-8">
              <h5>Kategori: </h5>
              <select
                name="category"
                className="text-black text-center rounded-sm"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Välj...</option>
                <option value="garden">Trädgård</option>
                <option value="book">Böcker</option>
              </select>
            </div>
            {formData.category === "book" && (
              <div>
                <h4>Författare:</h4>
                <input
                  type="text"
                  name="author"
                  className="text-black capitalize"
                  value={formData.author}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {formData.category === "garden" && (
              <div>
                <div>
                  <h4>Sort:</h4>
                  <input
                    type="text"
                    name="sort"
                    className="text-black"
                    value={formData.sort}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <img
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.title}
                height={60}
                width={43}
              />
              <label htmlFor="file-input">
                <FontAwesomeIcon icon={faCloudArrowUp} size="2xl" />
              </label>
              <input
                type="file"
                name="image"
                id="file-input"
                multiple
                hidden
                onChange={handleInputChange}
              />
            </div>
            {selectedFileNames.length > 0 && (
              <div className="mt-2">
                <h4>Valda filer:</h4>
                <ul>
                  {selectedFileNames.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-center mt-4 px-4 py-2 bg-thirdLightBlue dark:bg-thirdDarkBlue rounded-md">
              <button type="submit">Spara</button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateProductModal;
