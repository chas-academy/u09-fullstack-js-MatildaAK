import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser: React.FC = () => {
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    role: 0,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = event.target as
      | HTMLInputElement
      | HTMLSelectElement;

    if (event.target instanceof HTMLSelectElement) {
      const numericValue = parseInt(value, 10);
      setUserData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:4000/anvandare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      console.log("Data som skickas:", userData);
      const data = await response.json();
      if (response.ok) {
        window.alert("Användare skapad framgångsrikt!");
        setUserData({ userName: "", email: "", password: "", role: 0 });
        navigate("/admin");
      } else {
        setStatusMessage(data.message || "Fel vid skapande av användare.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Något gick fel.");
    }
  };

  return (
    <div className="text-black dark:text-white">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mt-4 border-4 border-primaryDarkGreen rounded-sm mx-16 py-4">
          <div>
          <h2>Skapa Användare</h2>
            <div className="flex mt-4 gap-x-8">
              <input
                type="text"
                name="userName"
                className="text-black"
                value={userData.userName}
                onChange={handleInputChange}
                placeholder="Användarnamn"
                required
              />
            </div>
            <div className="flex mt-4 gap-x-8">
              <input
                type="email"
                name="email"
                className="text-black"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="E-post"
                required
              />
            </div>
            <div className="flex mt-4 gap-x-8">
              <input
                type="password"
                name="password"
                className="text-black"
                value={userData.password}
                onChange={handleInputChange}
                placeholder="Lösenord"
                required
              />
            </div>
            <div className="flex mt-4 gap-x-8">
              <select
                name="role"
                className="text-black text-center rounded-sm"
                value={userData.role}
                onChange={handleInputChange}
              >
                <option value={1}>Användare</option>
                <option value={2}>Admin</option>
              </select>
            </div>
            <div className="flex justify-center mt-4 px-4 py-2 bg-thirdLightBlue dark:bg-thirdDarkBlue rounded-md">
            <button type="submit">Skapa Användare</button>
            </div>
          </div>
        </div>
      </form>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default CreateUser;