import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    }
    fetchData();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    const filtered = users.filter((user) =>
      Object.values(user)
        .join("")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(1); // Reset to the first page when searching
  };

  const handleEdit = (id, newValues) => {
    setFilteredUsers(
      filteredUsers.map((user) =>
        user.id === id ? { ...user, ...newValues } : user
      )
    );
  };

  const handleDelete = (id) => {
    setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
  };

  const handleSelectAll = (event) => {
    const selected = event.target.checked;
    setFilteredUsers(
      selected
        ? filteredUsers.map((user) => ({ ...user, isSelected: true }))
        : filteredUsers.map((user) => ({ ...user, isSelected: false }))
    );
  };

  const handleSelectUser = (id) => {
    setFilteredUsers(
      filteredUsers.map((user) =>
        user.id === id ? { ...user, isSelected: !user.isSelected } : user
      )
    );
  };

  const handleDeleteSelected = () => {
    setFilteredUsers(filteredUsers.filter((user) => !user.isSelected));
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <input
        type="text"
        placeholder="Search by name,email or role"
        onChange={handleSearch}
        className="border p-2 mb-4 w-full search-icon"
      />
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="p-2 border-r ">
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th className="p-2 border-r">Name</th>
            <th className="p-2 border-r">Email</th>
            <th className="p-2 border-r">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers
            .slice((page - 1) * pageSize, page * pageSize)
            .map((user, index) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      checked={user.isSelected || false}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td className={`p-2 ${user.isEditing ? "bg-gray-100" : ""}`}>
                    {user.isEditing ? (
                      <input
                        type="text"
                        value={user.name}
                        onChange={(event) =>
                          handleEdit(user.id, {
                            ...user,
                            name: event.target.value,
                          })
                        }
                        className="w-full p-1 border"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="p-2 border-r">{user.email}</td>
                  <td className={`p-2 ${user.isEditing ? "bg-gray-100" : ""}`}>
                    {user.isEditing ? (
                      <input
                        type="text"
                        value={user.role}
                        onChange={(event) =>
                          handleEdit(user.id, {
                            ...user,
                            role: event.target.value,
                          })
                        }
                        className="w-full p-1 border"
                      />
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="p-2 flex">
                    {user.isEditing ? (
                      <>
                        <button
                          className="edit bg-blue-500 text-white px-2 py-1 rounded mr-1"
                          onClick={() =>
                            handleEdit(user.id, {
                              ...user,
                              isEditing: false,
                              isSelected: false,
                            })
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="delete bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(user.id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="edit text-grey-200 px-2 py-1 rounded mr-1"
                          onClick={() =>
                            handleEdit(user.id, { ...user, isEditing: true })
                          }
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="delete text-red-400 px-2 py-1 rounded"
                          onClick={() => handleDelete(user.id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                {index < pageSize - 1 && (
                  <tr>
                    <td colSpan="5" className="border-b"></td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </table>
      <div className="flex justify-around">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-full mt-2 block -mx-10"
          onClick={handleDeleteSelected}
        >
          Delete Selected
        </button>
        <Pagination
          page={page}
          pageSize={pageSize}
          total={filteredUsers.length}
          onPageChange={setPage}
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default UserTable;
