"use client";
import { useEffect, useState, useMemo } from "react";

export default function RoomsPage() {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    ruangan: "", // Default value untuk dropdown diubah menjadi kosong
    tanggal: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Menampilkan 10 item per halaman
  const [searchQuery, setSearchQuery] = useState(""); // State untuk fitur pencarian
  const [sortOrder, setSortOrder] = useState("asc"); // State untuk urutan sorting

  useEffect(() => {
    fetch("/bookings.json") // Pastikan file bookings.json ada di folder public
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.ruangan || !formData.tanggal) {
      alert("Semua field harus diisi!");
      return;
    }

    const newBooking = {
      id: bookings.length ? Math.max(...bookings.map((b) => b.id)) + 1 : 1,
      ...formData,
      status: "Pending", // Default status saat menambahkan booking baru
    };

    setBookings([...bookings, newBooking]);
    setFormData({ nama: "", ruangan: "", tanggal: "" }); // Reset form
  };

  // Update status
  const updateStatus = (id, newStatus) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status: newStatus } : booking
      )
    );
  };

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Filter bookings based on search query
  const filteredBookings = useMemo(() => {
    if (!searchQuery) return bookings; // Jika tidak ada query pencarian, tampilkan semua data
    return bookings.filter((booking) =>
      booking.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [bookings, searchQuery]);

  // Sort bookings by name
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.nama.localeCompare(b.nama);
      } else {
        return b.nama.localeCompare(a.nama);
      }
    });
  }, [filteredBookings, sortOrder]);

  // Paginate bookings
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedBookings.slice(start, end);
  }, [sortedBookings, currentPage, itemsPerPage]);

  // Calculate total pages for pagination
  const totalPages = useMemo(() => {
    return Math.ceil(sortedBookings.length / itemsPerPage);
  }, [sortedBookings, itemsPerPage]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Form Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          FORM BOOKING RUANGAN
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              required
            />
          </div>

          {/* Ruangan Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ruangan:
            </label>
            <select
              value={formData.ruangan}
              onChange={(e) =>
                setFormData({ ...formData, ruangan: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Pilih Ruangan --</option> {/* Placeholder */}
              <option value="Room A">Room A</option>
              <option value="Room B">Room B</option>
              <option value="Room C">Room C</option>
              <option value="Room D">Room D</option>
            </select>
          </div>

          {/* Tanggal Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal:
            </label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) =>
                setFormData({ ...formData, tanggal: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition-all duration-200"
          >
            Simpan
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          DAFTAR BOOKING RUANGAN
        </h1>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-3 text-center">
                  No
                </th>
                <th
                  className="border border-gray-200 px-4 py-3 text-center cursor-pointer"
                  onClick={toggleSortOrder} // Sorting by nama
                >
                  Nama{" "}
                  {sortOrder === "asc" ? (
                    <span>&uarr;</span>
                  ) : (
                    <span>&darr;</span>
                  )}
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center">
                  Ruangan
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center">
                  Tanggal
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center">
                  Status
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking, index) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-left">
                    {booking.nama}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {booking.ruangan}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {new Date(booking.tanggal).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {booking.status === "Confirmed" ? (
                      <span className="text-green-500">Confirmed</span>
                    ) : booking.status === "Pending" ? (
                      <span className="text-yellow-500">Pending</span>
                    ) : (
                      <span className="text-red-500">Cancelled</span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => updateStatus(booking.id, "Confirmed")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-white hover:text-green-500 hover:border hover:border-green-500 transition-all duration-200"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, "Cancelled")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-white hover:text-red-500 hover:border hover:border-red-500 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
    </div>
  );
}