import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = event.target;

    const input = event.target as HTMLInputElement;

    if (type === "file" && input.files) {
      const fileArray = Array.from(input.files);
      setProductData((prevFormData) => ({
        ...prevFormData,
        [name]: fileArray,
      }));
      setSelectedFileNames(fileArray.map((file) => file.name));
    } else if (name === "price") {
      const priceValue = parseFloat(value);
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
      const value = productData[key as keyof IFormData];
      formDataToSend.append(
        key,
        typeof value === "number" ? value.toString() : value || ""
      );
    });

    if (productData.image && Array.isArray(productData.image)) {
      productData.image.forEach((file) => {
        formDataToSend.append("image", file);
      });
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/skapa", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          setProductStatus("success");
          window.alert(
            "Woho, produkt är nu skapad och du dirigeras till förstasidan!"
          );
          console.log(productStatus);
          navigate("/admin");
        } else {
          setProductStatus("error");
          window.alert("Produkt är inte skapad. Var god försök igen.");
        }

        console.log("Det här är data från DB:", data);
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
        href="/admin"
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
    </div>
  );
};

export default AddProduct;
