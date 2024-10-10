import {
  faTrashCan,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import UpdateUser from "../UpdateUser/UpdateUser";
import BASE_URL from "../../../config";

interface IUser {
  _id: string;
  name?: string;
  userName: string;
  password: string;
  email: string;
  image?: string;
  role: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/anvandare/alla`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Något gick fel vid hämtning av användare");
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.users)) {
          throw new Error("Felaktig data: Ingen användardata mottagen");
        }

        setUsers(data.users);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="text-white">Laddar användare...</div>;
  }

  if (error) {
    return <div className="text-white">Fel: {error}</div>;
  }

  const openModal = (user: IUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdate = (updatedUser: IUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
      )
    );
    closeModal();
  };

  const removeFromList = async (id: string) => {
    const confirmed = window.confirm(
      "Är du säker på att du vill radera användaren?"
    );
    if (!confirmed) {
      return;
    }

    try {
      //   const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/anvandare/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.status);

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

        window.alert("Användare har blivit borttaget.");

        localStorage.removeItem("id");
        localStorage.removeItem("token");
      } else {
        throw new Error("Lyckades inte radera användare");
      }
    } catch (error) {
      console.error("Update user data error:", error);
    }
  };

  return (
    <div className="text-black dark:text-white my-4 flex justify-start flex-col">
      <div className="m-2">
        Roll 1 = Användare <br /> Roll 2 = Admin
      </div>
      {Array.isArray(users) && users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Namn</th>
              <th>Användarnamn</th>
              <th>Email</th>
              <th>Roll</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="text-center">
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b-2 border-black dark:border-white"
              >
                <td>{user.name}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faUserPen}
                    onClick={() => openModal(user)}
                    className="cursor-pointer"
                  />
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={() => removeFromList(user._id)}
                    className="pl-4 text-error cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <li>Inga användare hittades</li>
      )}
      {selectedUser && (
        <UpdateUser
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onUpdate={handleUpdate}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default UserList;
