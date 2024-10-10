import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { IUser } from "../../../interface/IUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faUserTie,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface UpdateUserProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onUpdate: (updatedUser: IUser) => void;
  user: IUser;
}

const UpdateUser: React.FC<UpdateUserProps> = ({
  isOpen,
  onRequestClose,
  onUpdate,
  user,
}) => {
  Modal.setAppElement("#root");
  const [userData, setUserData] = useState<IUser>({
    _id: "",
    name: "",
    userName: "",
    role: 0,
    email: "",
    password: "",
    image: "",
  });
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  useEffect(() => {
    if (user && isOpen) {
      setUserData(user);
    }
  }, [user, isOpen]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type } = event.target;

    const input = event.target as HTMLInputElement;

    if (type === "file" && input.files) {
      const fileArray = Array.from(input.files);
      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: fileArray,
      }));
      setSelectedFileNames(fileArray.map((file) => file.name));
    } else {
      const value = event.target.value;
      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: value,
      }));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log("Hämtar Token:", token);

    const formDataToSend = new FormData();

    if (userData.name) {
      formDataToSend.append("name", userData.name);
    }

    if (userData.userName) {
      formDataToSend.append("userName", userData.userName);
    }

    if (userData.password) {
      formDataToSend.append("password", userData.password);
    }

    if (userData.email) {
      formDataToSend.append("email", userData.email);
    }

    if (userData.role !== undefined) {
      formDataToSend.append("role", userData.role.toString());
    }

    if (userData.image && Array.isArray(userData.image)) {
      userData.image.forEach((image: File) => {
        formDataToSend.append("image", image);
      });
    }

    try {
      const response = await fetch(
        `http://localhost:4000/anvandare/${userData._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Lyckades inte uppdatera användare");
      }

      const updatedUser = await response.json();
      onUpdate(updatedUser);
      onRequestClose();
      window.alert("Användare är uppdaterad.");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <div className="flex justify-end">
        <FontAwesomeIcon
          icon={faXmark}
          size="2xl"
          className="text-thirdDarkBlue cursor-pointer"
          onClick={onRequestClose}
        />
      </div>
      <h2 className="text-center font-bold">Uppdatera användare</h2>
      <form onSubmit={handleUpdate}>
        <div className="flex justify-center mt-4 mx-16 py-4">
          <div>
            <div>
              <h4 className="font-bold">Namn: </h4>
              <input
                type="text"
                name="name"
                className="text-black capitalize bg-primaryLightGreen"
                value={userData.name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <h4 className="font-bold">Användarnamn: </h4>
              <input
                type="text"
                name="userName"
                className="text-black bg-primaryLightGreen"
                value={userData.userName || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <h4 className="font-bold">Email: </h4>
              <input
                type="text"
                name="email"
                className="text-black bg-primaryLightGreen"
                value={userData.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <h4 className="font-bold">Nytt lösenord: </h4>
              <input
                type="text"
                name="password"
                className="text-black bg-primaryLightGreen"
                value={userData.password || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex mt-4 gap-x-8">
              <h5 className="font-bold">Roll: </h5>
              <select
                name="role"
                className="text-black text-center rounded-sm"
                value={userData.role || 0}
                onChange={handleInputChange}
              >
                <option value={0}>Välj...</option>
                <option value={1}>Användare</option>
                <option value={2}>Admin</option>
              </select>
            </div>
            <div className="flex justify-center mt-4">
              <div>
                {user.image ? (
                  <img
                    src={`data:image/jpeg;base64,${user.image}`}
                    alt={user.name || "Användarbild"}
                    height={60}
                    width={43}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="h-[55px] w-[55px] text-black"
                  />
                )}
              </div>
            </div>
            <div>
              <div className="flex justify-center mt-4">
                <label htmlFor="file-input">
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    size="2xl"
                    className="text-thirdDarkBlue"
                  />
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
            <div className="flex justify-center mt-4 px-4 py-2 bg-thirdDarkBlue rounded-md text-white">
              <button type="submit">Spara</button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateUser;
