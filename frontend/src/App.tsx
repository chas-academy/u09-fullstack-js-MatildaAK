import { Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { useAuth } from './components/Auth/Auth'

function App() {
    const navigate = useNavigate()
    const { login, logout, isAuthenticated } = useAuth()

    const handleLogin = (identifier: string, userId: string, token: string) => {
        login(identifier, userId, token)
        navigate('/')
    }

    const handleLogout = async () => {
        await logout();
        navigate('/')
    }
    return (
        <>
            <div className='min-h-screen flex flex-col'>
                <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

                <main className='flex-grow'>
                    <Outlet
                        context={{
                            onLogin: handleLogin,
                        }}
                    />
                </main>

                <Footer />
            </div>
        </>
    )
}

export default App
