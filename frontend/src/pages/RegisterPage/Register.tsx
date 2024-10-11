import React, { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { Link, useNavigate } from 'react-router-dom'
import BASE_URL from '../../config'

const RegisterForm: React.FC = () => {
    const [userData, setUserData] = useState({
        name: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [registrationStatus, setRegistrationStatus] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
          ...userData,
          [event.target.name]: event.target.value,
        });
      };


      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Hantera formulär här
    
        fetch(
          `${BASE_URL}/registrera`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setRegistrationStatus("success");
              window.alert("Registrering misslyckades. Var god försök igen.");
              console.log(registrationStatus);
            } else {
              setRegistrationStatus("error");
              window.alert("Woho, du är nu registrerad & dirigeras till Login!");
              // Redirect the user, show a success message, etc.
              navigate("/Login");
            }
    
            console.log("Det här är data från DB:", data);
            // Handle response data
          })
          .catch((error) => {
            console.error("Error:", error);
            // Handle the error
            window.alert("Registrering misslyckades. Var god försök igen.");
          });
      };

    return (
        <div className="h-svh md:h-lvh">
            <div className="flex items-center justify-center">
                <div className="my-10 mx-2 py-6 w-80 bg-primaryLightGreen dark:bg-primaryDarkGreen rounded-md md:w-96">
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                            type="text"
                            value={userData.name}
                            onChange={handleInputChange}
                            name="name"
                            placeholder="Namn"
                        />
                        <Input
                            type="text"
                            value={userData.userName}
                            onChange={handleInputChange}
                            name="userName"
                            placeholder="Användarnamn"
                        />
                        <Input
                            type="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            name="email"
                            placeholder="E-post"
                        />
                        <Input
                            type="password"
                            value={userData.password}
                            onChange={handleInputChange}
                            name="password"
                            placeholder="Lösenord"
                        />
                                                <Input
                            type="password"
                            value={userData.confirmPassword}
                            onChange={handleInputChange}
                            name="confirmPassword"
                            placeholder="Upprepa lösenord"
                        />
                        <div className="flex justify-center">
                            <Button type="submit" size="small" variant="third">
                                Skapa användare
                            </Button>
                        </div>

                        <div className="text-center mt-4 mx-12 md:mx-2 text-black dark:text-white">
                            Har du redan ett konto?{' '}
                            <Link
                                to="/login"
                                className="underline hover:underline-offset-4 font-bold"
                            >
                                Logga in här!
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
