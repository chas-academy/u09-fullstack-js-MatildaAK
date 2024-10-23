import React, { useState } from 'react'
import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import BASE_URL from '../../config'

interface ContextType {
    onLogin: (identifier: string, userId: string, token: string) => void
}

const LoginForm: React.FC = () => {
    const [loginIdentifier, setLoginIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const { onLogin } = useOutletContext<ContextType>()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: loginIdentifier,
                    password: password,
                }),
            })

            if (!response.ok) {
                // Om svaret inte är OK, kasta ett fel
                const errorData = await response.json()
                throw new Error(errorData.error || 'Inloggning misslyckades')
            }

            const data = await response.json()

            if (response.ok) {
                const { identifier, user, token } = data
                const { _id } = user
                onLogin(identifier, _id, token)

                localStorage.setItem('token', data.token)
                localStorage.setItem('id', _id)
            } else {
                console.error(data.error)
            }

            setLoginIdentifier('')
            setPassword('')

            setSuccess('Inloggning lyckades!')
            navigate('/')
            setError(null)
        } catch (err) {
            // Om det uppstår ett fel, sätt felet
            setError('Inloggning misslyckades. Kontrollera dina uppgifter.')
            setSuccess(null)
            console.error('Error during login:', err)
        }
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
                            name="identifier"
                            placeholder="Användarnamn eller E-post"
                        />
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            placeholder="Lösenord"
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-green-500">{success}</p>}
                        
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
