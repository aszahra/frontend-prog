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

  // Filtering dengan useMemo
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Sorting dengan useMemo
  const sortedUsers = useMemo(() => {
    if (!sortBy) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      return a[sortBy].localeCompare(b[sortBy]) * order;
    });
  }, [filteredUsers, sortBy, sortOrder]);

  // Paginasi dengan useMemo
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedUsers.slice(start, end);
  }, [sortedUsers, currentPage, itemsPerPage]);

  // Total halaman dengan useMemo
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
    <div
      style={{ marginTop: "20px", paddingLeft: "80px", paddingRight: "80px" }}
    >
      <h1>Daftar Pengguna</h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{ flex: 1, padding: "8px" }}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
          }}
        >
          Add User
        </button>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #dee2e6",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th
              onClick={() => handleSort("name")}
              style={{
                border: "1px solid #dee2e6",
                padding: "12px",
                cursor: "pointer",
              }}
            >
              Nama {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              onClick={() => handleSort("email")}
              style={{
                border: "1px solid #dee2e6",
                padding: "12px",
                cursor: "pointer",
              }}
            >
              Email {sortBy === "email" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              style={{
                border: "1px solid #dee2e6",
                padding: "12px",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user, index) => (
            <tr key={user.id}>
              <td
                style={{
                  border: "1px solid #dee2e6",
                  padding: "8px",
                  verticalAlign: "top",
                }}
              >
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td
                style={{
                  border: "1px solid #dee2e6",
                  padding: "8px",
                  verticalAlign: "top",
                }}
              >
                {user.name}
              </td>
              <td
                style={{
                  border: "1px solid #dee2e6",
                  padding: "8px",
                  verticalAlign: "top",
                }}
              >
                {user.email}
              </td>
              <td
                style={{
                  border: "1px solid #dee2e6",
                  padding: "8px",
                  verticalAlign: "top",
                }}
              >
                <button
                  onClick={() => handleEdit(user)}
                  style={{
                    marginRight: "5px",
                    padding: "4px 8px",
                    backgroundColor: "#ffc107",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#dc3545",
                    color: "white",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", gap: "5px" }}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ padding: "8px" }}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              padding: "8px",
              backgroundColor: currentPage === i + 1 ? "#007bff" : "#f0f0f0",
              color: currentPage === i + 1 ? "white" : "black",
            }}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ padding: "8px" }}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>{editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}</h2>
            <div style={{ marginBottom: "15px" }}>
              <label>Nama:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "white",
                }}
              >
                {editingUser ? "Update" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
