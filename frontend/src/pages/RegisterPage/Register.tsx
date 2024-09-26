import React, { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { Link } from 'react-router-dom'

const RegisterForm: React.FC = () => {
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Registrerad användare', { userName, email, password })
    }

    return (
        <div className="h-svh md:h-lvh">
            <div className="flex items-center justify-center">
                <div className="my-10 mx-2 py-6 w-80 bg-primaryLightGreen dark:bg-primaryDarkGreen rounded-md md:w-96">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            name="email"
                            placeholder="Användarnamn"
                        />
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            placeholder="E-post"
                        />
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            placeholder="Lösenord"
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
