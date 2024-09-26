import React, { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { Link } from 'react-router-dom'

const LoginForm: React.FC = () => {
    const [loginIdentifier, setLoginIdentifier] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Logging in', { loginIdentifier, password })
    }

    return (
        <div className="h-svh md:h-lvh">
            <div className="flex items-center justify-center">
                <div className="my-10 mx-2 py-6 w-80 bg-primaryLightGreen dark:bg-primaryDarkGreen rounded-md md:w-96">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            name="email"
                            placeholder="Användarnamn eller E-post"
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
                            Logga in
                        </Button>
                        </div>

                        <div className="text-center mt-4 mx-12 md:mx-2 text-black dark:text-white">
                            Har du inget konto?{' '}
                            <Link
                                to="/register"
                                className="underline hover:underline-offset-4 font-bold"
                            >
                                Registrera dig här!
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
