"use client";
import { useEffect, useState, useMemo } from "react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Menampilkan 5 item per halaman
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    kapasitas: "",
    kategori: "",
    harga: "",
    status: "Available",
  });
  const [editingRoom, setEditingRoom] = useState(null);

  // Fetch data from room.json
  useEffect(() => {
    fetch("/rooms.json")
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  // Filter rooms based on search term
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) =>
      room.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rooms, searchTerm]);

  // Sort rooms based on column and order
  const sortedRooms = useMemo(() => {
    if (!sortBy) return filteredRooms;
    return [...filteredRooms].sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (typeof a[sortBy] === "string") {
        return a[sortBy].localeCompare(b[sortBy]) * order;
      }
      return (a[sortBy] - b[sortBy]) * order;
    });
  }, [filteredRooms, sortBy, sortOrder]);

  // Paginate rooms
  const paginatedRooms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedRooms.slice(start, end);
  }, [sortedRooms, currentPage, itemsPerPage]);

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    return Math.ceil(sortedRooms.length / itemsPerPage);
  }, [sortedRooms, itemsPerPage]);

  // Handle sorting
  const handleSort = (column) => {
    setSortBy(column);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Handle delete action
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setRooms(rooms.filter((room) => room.id !== id));
    }
  };

  // Handle edit action
  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      nama: room.nama,
      kapasitas: room.kapasitas,
      kategori: room.kategori,
      harga: room.harga,
      status: room.status,
    });
    setIsModalOpen(true);
  };

  // Handle form submission (add/edit room)
  const handleSubmit = () => {
    if (!formData.nama || !formData.kapasitas || !formData.kategori || !formData.harga) {
      alert("Semua field harus diisi!");
      return;
    }
    if (editingRoom) {
      setRooms(
        rooms.map((room) =>
          room.id === editingRoom.id ? { ...room, ...formData } : room
        )
      );
    } else {
      const newId = rooms.length ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
      setRooms([...rooms, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
    setFormData({ nama: "", kapasitas: "", kategori: "", harga: "", status: "Available" });
    setEditingRoom(null);
  };

  // Handle approve action with validation
  const handleApprove = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menyetujui ruangan ini?")) {
      setRooms(rooms.map((room) => (room.id === id ? { ...room, status: "Available" } : room)));
    }
  };

  // Handle reject action with validation
  const handleReject = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menolak ruangan ini?")) {
      setRooms(rooms.map((room) => (room.id === id ? { ...room, status: "Unavailable" } : room)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          DAFTAR ROOM
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
            Add Room
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
                  onClick={() => handleSort("nama")}
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer"
                >
                  <div className="text-center items-center">
                    Nama{" "}
                    {sortBy === "nama" && (sortOrder === "asc" ? "↑" : "↓")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("kapasitas")}
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer"
                >
                  <div className="text-center items-center">
                    Kapasitas{" "}
                    {sortBy === "kapasitas" && (sortOrder === "asc" ? "↑" : "↓")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("kategori")}
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer"
                >
                  <div className="text-center items-center">
                    Kategori{" "}
                    {sortBy === "kategori" && (sortOrder === "asc" ? "↑" : "↓")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("harga")}
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer"
                >
                  <div className="text-center items-center">
                    Harga{" "}
                    {sortBy === "harga" && (sortOrder === "asc" ? "↑" : "↓")}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer"
                >
                  <div className="text-center items-center">
                    Status{" "}
                    {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </div>
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRooms.map((room, index) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {room.nama}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {room.kapasitas}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-left">
                    {room.kategori}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-left">
                    Rp {room.harga.toLocaleString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {room.status === "Available" ? (
                      <span className="text-green-500">Available</span>
                    ) : (
                      <span className="text-red-500">Unavailable</span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <div className="flex flex-col gap-2">
                      {/* Baris Pertama: Approve dan Reject */}
                      <div className="flex justify-center gap-2">
                        {room.status === "Available" ? (
                          <button
                            onClick={() => handleReject(room.id)}
                            className="px-3 py-1 bg-red-700 text-white rounded hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition-all duration-200"
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(room.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition-all duration-200"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                      {/* Baris Kedua: Edit dan Delete */}
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-white hover:text-yellow-500 hover:border hover:border-yellow-500 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-white hover:text-red-700 hover:border hover:border-red-700 transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
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
              {editingRoom ? "Edit Room" : "Tambah Room Baru"}
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
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama"
                />
              </div>
              {/* Kapasitas Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapasitas:
                </label>
                <input
                  type="number"
                  value={formData.kapasitas}
                  onChange={(e) =>
                    setFormData({ ...formData, kapasitas: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan kapasitas"
                />
              </div>
              {/* Kategori Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori:
                </label>
                <input
                  type="text"
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan kategori"
                />
              </div>
              {/* Harga Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harga:
                </label>
                <input
                  type="number"
                  value={formData.harga}
                  onChange={(e) =>
                    setFormData({ ...formData, harga: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan harga"
                />
              </div>
            </div>
            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition-all duration-200"
              >
                {editingRoom ? "Update" : "Simpan"}
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