"use client";

import { useState, useEffect } from "react";

export default function RoomPage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    kapasitas: "",
    kategori: "",
    harga: "",
    status: "",
  });

  // Fetch data from room.json
  useEffect(() => {
    fetch("/data/room.json")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setFilteredRooms(data);
      });
  }, []);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredRooms].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredRooms(sortedData);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = rooms.filter((room) =>
      Object.values(room).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );
    setFilteredRooms(filtered);
    setCurrentPage(1); // Reset pagination
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const newRoom = { id: rooms.length + 1, ...formData };
    setRooms([...rooms, newRoom]);
    setFilteredRooms([...filteredRooms, newRoom]);
    closeModal();
    setFormData({
      nama: "",
      kapasitas: "",
      kategori: "",
      harga: "",
      status: "",
    });
  };

  return (
    <div className="p-4">
      {/* Search and Add Button */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded"
        />
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tambah
        </button>
      </div>

      {/* Table */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("nama")}
              className="cursor-pointer border p-2"
            >
              Nama
            </th>
            <th
              onClick={() => handleSort("kapasitas")}
              className="cursor-pointer border p-2"
            >
              Kapasitas
            </th>
            <th
              onClick={() => handleSort("kategori")}
              className="cursor-pointer border p-2"
            >
              Kategori
            </th>
            <th
              onClick={() => handleSort("harga")}
              className="cursor-pointer border p-2"
            >
              Harga
            </th>
            <th
              onClick={() => handleSort("status")}
              className="cursor-pointer border p-2"
            >
              Status
            </th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((room) => (
            <tr key={room.id}>
              <td className="border p-2">{room.nama}</td>
              <td className="border p-2">{room.kapasitas}</td>
              <td className="border p-2">{room.kategori}</td>
              <td className="border p-2">{room.harga}</td>
              <td className="border p-2">{room.status}</td>
              <td className="border p-2">
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                  Approve
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded mr-2">
                  Reject
                </button>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                  Edit
                </button>
                <button className="bg-gray-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Tambah Ruangan</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Kapasitas</label>
                <input
                  type="number"
                  name="kapasitas"
                  value={formData.kapasitas}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Kategori</label>
                <input
                  type="text"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Harga</label>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
