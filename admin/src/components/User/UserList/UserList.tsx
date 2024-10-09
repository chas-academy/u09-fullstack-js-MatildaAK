import { useEffect, useState } from "react";

interface IUser {
  _id: string;
  name?: string;
  userName: string;
  email: string;
  image?: string;
  role: number;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/anvandare/alla", {
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
  return (
    
    <div className="user-list text-black dark:text-white my-4 flex justify-start flex-col">
        <div className="m-2">Roll 1 = Användare <br /> Roll 2 = Admin</div>
      {Array.isArray(users) && users.length > 0 ? (
        users.map((user) => (
          <table key={user._id} className="border-b-2 border-black dark:border-white">
            <thead>
              <tr>
                <th>Namn</th>
                <th>Användarnamn</th>
                <th>Email</th>
                <th>Roll</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td>{user.name}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            </tbody>
          </table>
        ))
      ) : (
        <li>Inga användare hittades</li>
      )}
    </div>
  );
};

export default UserList;
