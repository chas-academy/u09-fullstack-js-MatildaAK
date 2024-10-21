import { useEffect, useState } from 'react'
import BASE_URL from '../../config'
import { IUser } from '../../pages/User/IUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'

const User: React.FC = () => {
    const [user, setUser] = useState<IUser>({
        name: '',
        userName: '',
        email: '',
        password: '',
        image: '',
        role: 0,
        createdAt: '',
    })

    

    useEffect(() => {
        const fetchUserData = async () => {

            try {
                const id = localStorage.getItem('id')
                const token = localStorage.getItem('token')

                if (!id || !token) {
                    throw new Error('User ID or token not found')
                }

                const response = await fetch(`${BASE_URL}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || 'Failed to fetch user data')
                }

                const data = await response.json()
                setUser(data)
            } catch (error) {
                console.error('Fetch user data error:', error)
            }
        }
        

        fetchUserData()
    }, [])

    return (
        <div className='flex justify-center mt-6'>
            <div className="grid rounded-lg shadow-2xl text-black dark:text-white bg-primaryLightGreen dark:bg-primaryDarkGreen py-4 min-h-full w-96 mb-8 xl:w-[600px]">
                {/* <UserUpdate user={user} setUserData={setUserData} /> */}
                <div className="flex">
                    <div className="ml-6 flex items-center">
                        {user.image ? (
                            <img
                                src={`data:image/jpeg;base64,${user.image}`}
                                alt={user.name || 'Användarbild'}
                                className="rounded-full w-[35px] h-[35px] cursor-pointer"
                            />
                        ) : (
                            <FontAwesomeIcon
                                icon={faUserTie}
                                className="h-[35px] w-[35px] text-black dark:text-white cursor-pointer"
                            />
                        )}
                    </div>
                    <div className="text-left ml-8 w-[70%] xl:w-[75%]">

                        <div className="flex xl:mt-4">
                            <p>Namn:</p>
                            <p className="text-xs xl:text-lg flex items-center ml-4">{user.name}</p>
                        </div>
                        <div className="flex xl:mt-4">
                            <p>Användarnamn:</p>
                            <p className="text-xs xl:text-lg flex items-center ml-4">{user.userName}</p>
                        </div>

                        <div className="flex xl:mt-4">
                            <p>Email:</p>
                            <p className="text-xs xl:text-lg flex items-center ml-4">{user.email}</p>
                        </div>
                        <div className="flex xl:mt-4">
                            <p>Medlem sedan:</p>
                            <p className="text-xs xl:text-lg flex items-center ml-4">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User
