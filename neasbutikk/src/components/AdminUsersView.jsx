import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import {
  FaSpinner,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaCrown,
  FaUser,
} from "react-icons/fa";

function AdminUsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  useEffect(() => {
    const database = getDatabase();
    const usersRef = ref(database, "users");

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersArray = Object.entries(usersData).map(
            ([id, userData]) => ({
              id,
              ...userData,
              role: userData.role || "user", // Default role is user
              createdAt: userData.createdAt || "Unknown",
            })
          );

          // Sort alphabetically by name
          usersArray.sort((a, b) => {
            const nameA = (a.name || a.nickname || a.email || "").toLowerCase();
            const nameB = (b.name || b.nickname || b.email || "").toLowerCase();
            return nameA.localeCompare(nameB);
          });

          setUsers(usersArray);
        } else {
          setUsers([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        setError("Kunne ikke hente brukerdata: " + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtered users based on search term
  const filteredUsers = users.filter((user) => {
    const searchString = searchTerm.toLowerCase();
    const name = (user.name || "").toLowerCase();
    const nickname = (user.nickname || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const readableId = (user.readableId || "").toLowerCase();

    return (
      name.includes(searchString) ||
      nickname.includes(searchString) ||
      email.includes(searchString) ||
      readableId.includes(searchString)
    );
  });

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditFormData({
      nickname: user.nickname || "",
      name: user.name || "",
      role: user.role || "user",
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (userId) => {
    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${userId}`);

      await update(userRef, {
        ...editFormData,
        updatedAt: Date.now(),
      });

      setEditingUser(null);
      setEditFormData({});
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Feil ved oppdatering av bruker: " + error.message);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${userToDelete.id}`);

      await remove(userRef);

      setUserToDelete(null);
      setConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Feil ved sletting av bruker: " + error.message);
    }
  };

  const handleDeleteCancel = () => {
    setUserToDelete(null);
    setConfirmDelete(false);
  };

  return (
    <div className="w-full">
      <h2 className="font-mabry text-xl text-primary mb-4">
        Administrer brukere
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Søk etter brukere..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl text-primary font-mabry mb-3">
              Bekreft sletting
            </h3>
            <p className="font-mabrylight text-primary mb-6">
              Er du sikker på at du vil slette brukeren "{userToDelete.email}"?
              Dette vil slette all brukerdata og kan ikke angres.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white font-mabry rounded-lg py-2 px-4 flex-1 hover:bg-red-600 transition-all duration-200"
              >
                Slett bruker
              </button>
              <button
                onClick={handleDeleteCancel}
                className="border border-primary text-primary font-mabrylight rounded-lg py-2 px-4 flex-1 hover:bg-primary/10 transition-all duration-200"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <FaSpinner className="animate-spin text-3xl text-primary" />
          <span className="ml-2 font-mabrylight text-primary">
            Laster brukerdata...
          </span>
        </div>
      ) : (
        <div className="bg-neutral rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-base-300">
                  <th className="py-2 px-4 text-left font-mabry text-primary">
                    Bruker
                  </th>
                  <th className="py-2 px-4 text-left font-mabry text-primary">
                    E-post
                  </th>
                  <th className="py-2 px-4 text-left font-mabry text-primary">
                    Rolle
                  </th>
                  <th className="py-2 px-4 text-left font-mabry text-primary">
                    BrukerID
                  </th>
                  <th className="py-2 px-4 text-left font-mabry text-primary">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      {editingUser === user.id ? (
                        // Editing mode
                        <>
                          <td className="py-4 px-4">
                            <div className="space-y-2">
                              <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleEditFormChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                placeholder="Navn"
                              />
                              <input
                                type="text"
                                name="nickname"
                                value={editFormData.nickname}
                                onChange={handleEditFormChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                placeholder="Kallenavn"
                              />
                            </div>
                          </td>
                          <td className="py-4 px-4">{user.email}</td>
                          <td className="py-4 px-4">
                            <select
                              name="role"
                              value={editFormData.role}
                              onChange={handleEditFormChange}
                              className="px-2 py-1 border border-gray-300 rounded-md"
                            >
                              <option value="user">Bruker</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            {user.readableId || "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveEdit(user.id)}
                                className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                title="Lagre endringer"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                title="Avbryt"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View mode
                        <>
                          <td className="py-4 px-4">
                            <div className="font-mabry text-primary">
                              {user.name || user.nickname || "Ukjent navn"}
                            </div>
                            {user.nickname && user.nickname !== user.name && (
                              <div className="text-sm text-gray-500">
                                {user.nickname}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 font-mabrylight text-primary">
                            {user.email}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              {user.role === "admin" ? (
                                <span className="flex items-center text-yellow-600">
                                  <FaCrown className="mr-1" /> Admin
                                </span>
                              ) : (
                                <span className="flex items-center text-blue-600">
                                  <FaUser className="mr-1" /> Bruker
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mabrylight text-primary">
                            {user.readableId || "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditClick(user)}
                                className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                title="Rediger bruker"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                title="Slett bruker"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-8 text-center font-mabrylight text-gray-500"
                    >
                      {searchTerm
                        ? "Ingen brukere funnet for dette søket"
                        : "Ingen brukere å vise"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersView;
