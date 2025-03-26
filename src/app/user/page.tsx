"use client";

import { useEffect, useState, useMemo } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetch("/users.json")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    if (!sortBy) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      return a[sortBy].localeCompare(b[sortBy]) * order;
    });
  }, [filteredUsers, sortBy, sortOrder]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedUsers.slice(start, end);
  }, [sortedUsers, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedUsers.length / itemsPerPage);
  }, [sortedUsers, itemsPerPage]);

  const handleSort = (column) => {
    setSortBy(column);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert("Nama dan Email harus diisi!");
      return;
    }

    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
    } else {
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers([...users, { id: newId, ...formData }]);
    }

    setIsModalOpen(false);
    setFormData({ name: "", email: "" });
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          DAFTAR USER
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition-all duration-200"
          >
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th
                  onClick={() => handleSort("id")}
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer"
                >
                  <div className="items-center text-center">
                    No {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer"
                >
                  <div className="text-center items-center">
                    Nama{" "}
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer"
                >
                  <div className="items-center text-center">
                    Email{" "}
                    {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                  </div>
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.name}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-white hover:text-yellow-500 hover:border hover:border-yellow-500 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "left",
            gap: "8px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-8">
          {/* Modal Container */}
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            {/* Header */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingUser ? "Edit Pengguna" : "Tambah User Baru"}
            </h2>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Nama Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan email"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-8">
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition-all duration-200"
                // className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                {editingUser ? "Update" : "Simpan"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
