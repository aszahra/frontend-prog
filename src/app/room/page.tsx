"use client";

import React, { useState, useEffect } from "react";

export default function RoomPage() {
  const [data, setData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    kapasitas: 0,
    kategori: "",
    harga: 0,
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "nama", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch data dari room.json
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/room.json");
      const jsonData = await response.json();
      setData(jsonData);
    }
    fetchData();
  }, []);

  // Filtering data berdasarkan search term
  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sorting data
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleApprove = (id) => {
    alert(`Approved room with ID: ${id}`);
  };

  const handleReject = (id) => {
    alert(`Rejected room with ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const openEditModal = (id) => {
    const roomToEdit = data.find((item) => item.id === id);
    setFormData(roomToEdit);
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newData = {
      ...formData,
      id: data.length + 1,
    };
    setData((prevData) => [...prevData, newData]);
    setIsAddModalOpen(false);
    setFormData({ id: null, nama: "", kapasitas: 0, kategori: "", harga: 0, status: "" });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setData((prevData) =>
      prevData.map((item) => (item.id === formData.id ? formData : item))
    );
    setIsEditModalOpen(false);
    setFormData({ id: null, nama: "", kapasitas: 0, kategori: "", harga: 0, status: "" });
  };

  return (
    <div className="pt-8 pr-30 pl-30">
      <h1 className="text-2xl font-bold mb-4">Room Management</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {/* Tambah Button */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-7 ml-389"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Room
      </button>

      {/* Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("nama")}
            >
              Nama {sortConfig.key === "nama" && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("kapasitas")}
            >
              Kapasitas{" "}
              {sortConfig.key === "kapasitas" && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("kategori")}
            >
              Kategori{" "}
              {sortConfig.key === "kategori" && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("harga")}
            >
              Harga{" "}
              {sortConfig.key === "harga" && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status{" "}
              {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              <td className="border p-2">{row.nama}</td>
              <td className="border p-2">{row.kapasitas}</td>
              <td className="border p-2">{row.kategori}</td>
              <td className="border p-2">{row.harga}</td>
              <td className="border p-2">{row.status}</td>
              <td className="border p-2">
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => handleApprove(row.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleReject(row.id)}
                  >
                    Reject
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => openEditModal(row.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(row.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 disabled:bg-gray-100"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(sortedData.length / rowsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(sortedData.length / rowsPerPage)))
          }
          disabled={currentPage === Math.ceil(sortedData.length / rowsPerPage)}
          className="px-4 py-2 bg-gray-300 disabled:bg-gray-100"
        >
          Next
        </button>
      </div>

      {/* Modal Tambah */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Tambah Room</h2>
            <div className="mb-2">
              <label>Nama:</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label>Kapasitas:</label>
              <input
                type="number"
                value={formData.kapasitas}
                onChange={(e) =>
                  setFormData({ ...formData, kapasitas: parseInt(e.target.value) })
                }
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label>Kategori:</label>
              <input
                type="text"
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label>Harga:</label>
              <input
                type="number"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: parseInt(e.target.value) })}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label>Status:</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="border p-2 w-full"
                required
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Edit */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Room</h2>
            <div className="mb-2">
              <label>Nama:</label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label>Kapasitas:</label>
              <input
                type="number"
                value={formData.kapasitas}
                onChange={(e) =>
                  setFormData({ ...formData, kapasitas: parseInt(e.target.value) })
                }
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label>Kategori:</label>
              <input
                type="text"
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label>Harga:</label>
              <input
                type="number"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: parseInt(e.target.value) })}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label>Status:</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="border p-2 w-full"
                required
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-300"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}