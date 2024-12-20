import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../config";

interface IFormData {
  title: string;
  author?: string;
  category: string;
  image: string;
  sort?: string;
  description: string;
  price: number;
}

const AddProduct = () => {
  const [productData, setProductData] = useState<IFormData>({
    title: "",
    author: "",
    category: "",
    image: "",
    sort: "",
    description: "",
    price: 0,
  });

  const [productStatus, setProductStatus] = useState<
    "success" | "error" | undefined
  >(undefined);
  
  console.log(productStatus)

  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type } = event.target;
  
    const input = event.target as HTMLInputElement;
  
    if (type === "file" && input.files) {
      if (input.files.length > 0) {
        const file = input.files[0];
        setProductData((prevFormData) => ({
          ...prevFormData,
          [name]: file, 
        }));
        setSelectedFileNames([file.name]);
      }
    } else if (name === "price") {
      const priceValue = parseFloat(event.target.value);
      setProductData((prevFormData) => ({
        ...prevFormData,
        [name]: priceValue,
      }));
    } else {
      const value = event.target.value;
      setProductData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    Object.keys(productData).forEach((key) => {
      if (key !== "image") {
        const value = productData[key as keyof IFormData];
        formDataToSend.append(
          key,
          typeof value === "number" ? value.toString() : value || ""
        );
      }
    });

    if (productData.image) {
      formDataToSend.append("image", productData.image);
    }

    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/skapa`, {
      method: "POST",
      body: formDataToSend,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          setProductStatus("success");
          window.alert(
            "Woho, produkt är nu skapad och du dirigeras till förstasidan!"
          );
          navigate("/");
        } else {
          setProductStatus("error");
          window.alert("Produkt är inte skapad. Var god försök igen.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        window.alert("Produkt är inte skapad. Var god försök igen.");
      });
  };

  return (
    <div className="text-black dark:text-white">
      <a
        type="button"
        href="/"
        className="flex justify-center px-4 py-2 dark:bg-thirdDarkBlue mt-4 mx-24 rounded-md"
      >
        Avbryt
      </a>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mt-4 border-4 border-primaryDarkGreen rounded-sm mx-16 py-4">
          <div>
            <div>
              <h4>Titel: </h4>
              <input
                type="text"
                name="title"
                className="text-black capitalize"
                value={productData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <h4>Pris: </h4>
              <input
                type="text"
                name="price"
                className="text-black"
                value={productData.price}
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
                value={productData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex mt-4 gap-x-8">
              <h5>Kategori: </h5>
              <select
                name="category"
                className="text-black text-center rounded-sm"
                value={productData.category}
                onChange={handleInputChange}
              >
                <option value="">Välj...</option>
                <option value="garden">Trädgård</option>
                <option value="book">Böcker</option>
              </select>
            </div>
            {productData.category === "book" && (
              <div>
                <h4>Författare:</h4>
                <input
                  type="text"
                  name="author"
                  className="text-black capitalize"
                  value={productData.author}
                  onChange={handleInputChange}
                />
              </div>
            )}
            {productData.category === "garden" && (
              <div>
                <div>
                  <h4>Sort:</h4>
                  <input
                    type="text"
                    name="sort"
                    className="text-black"
                    value={productData.sort}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <label htmlFor="file-input">
                <FontAwesomeIcon icon={faCloudArrowUp} size="2xl" />
              </label>
              <input
                type="file"
                name="image"
                id="file-input"
                accept="image/*"
                multiple
                hidden
                onChange={handleInputChange}
              />
            </div>
            {selectedFileNames.length > 0 && (
              <div className="mt-2">
                <h4>Vald fil:</h4>
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
    </div>
  );
};

export default AddProduct;
