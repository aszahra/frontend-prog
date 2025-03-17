"use client";

import { useState, useMemo, useEffect } from "react";

interface Booking {
  id: number;
  name?: string;
  room?: string;
  date?: string;
  status?: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // State untuk form input
  const [newBooking, setNewBooking] = useState({
    name: "",
    room: "",
    date: "",
    status: "",
  });

  const pageSize = 5;

  // Fetch data dari file JSON (pastikan ada di public/bookings.json)
  useEffect(() => {
    fetch("/bookings.json") // Pastikan file ini ada di public/bookings.json
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  // Filtering data berdasarkan pencarian
  const filteredData = useMemo(() => {
    let filtered = bookings.filter(
      (item) =>
        (item.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.room?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.status?.toLowerCase() || "").includes(search.toLowerCase())
    );

    // Sorting data
    filtered.sort((a, b) => {
      const aValue = a[sortBy]?.toString().toLowerCase() || "";
      const bValue = b[sortBy]?.toString().toLowerCase() || "";

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [search, sortBy, sortOrder, bookings]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, page]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  // Handle submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi input
    if (!newBooking.name || !newBooking.room || !newBooking.date || !newBooking.status) {
      alert("Please fill in all fields.");
      return;
    }

    // Tambahkan data baru ke daftar booking
    const newId = bookings.length > 0 ? Math.max(...bookings.map((b) => b.id)) + 1 : 1;
    const newBookingData = { id: newId, ...newBooking };
    setBookings([...bookings, newBookingData]);

    // Reset form
    setNewBooking({
      name: "",
      room: "",
      date: "",
      status: "",
    });

    // Reset halaman ke 1
    setPage(1);
  };

  // Fungsi untuk mendapatkan warna latar belakang berdasarkan status
  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-100 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Booking List
      </h1>

      {/* Card untuk Form Input */}
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add New Booking
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newBooking.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room
            </label>
            <input
              type="text"
              name="room"
              value={newBooking.room}
              onChange={handleInputChange}
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter room"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={newBooking.date}
              onChange={handleInputChange}
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={newBooking.status}
              onChange={handleInputChange}
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300"
          >
            Add Booking
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari nama, ruangan, atau status..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset ke halaman pertama saat melakukan pencarian
          }}
          className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Booking Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th
                className="border border-gray-200 p-3 cursor-pointer bg-gray-100 text-gray-700 font-medium"
                onClick={() => handleSort("id")}
              >
                ID{" "}
                {sortBy === "id" ? (
                  sortOrder === "asc" ? (
                    "↑"
                  ) : (
                    "↓"
                  )
                ) : (
                  ""
                )}
              </th>
              <th
                className="border border-gray-200 p-3 cursor-pointer bg-gray-100 text-gray-700 font-medium"
                onClick={() => handleSort("name")}
              >
                Nama{" "}
                {sortBy === "name" ? (
                  sortOrder === "asc" ? (
                    "↑"
                  ) : (
                    "↓"
                  )
                ) : (
                  ""
                )}
              </th>
              <th
                className="border border-gray-200 p-3 cursor-pointer bg-gray-100 text-gray-700 font-medium"
                onClick={() => handleSort("room")}
              >
                Ruangan{" "}
                {sortBy === "room" ? (
                  sortOrder === "asc" ? (
                    "↑"
                  ) : (
                    "↓"
                  )
                ) : (
                  ""
                )}
              </th>
              <th
                className="border border-gray-200 p-3 cursor-pointer bg-gray-100 text-gray-700 font-medium"
                onClick={() => handleSort("date")}
              >
                Tanggal{" "}
                {sortBy === "date" ? (
                  sortOrder === "asc" ? (
                    "↑"
                  ) : (
                    "↓"
                  )
                ) : (
                  ""
                )}
              </th>
              <th
                className="border border-gray-200 p-3 cursor-pointer bg-gray-100 text-gray-700 font-medium"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortBy === "status" ? (
                  sortOrder === "asc" ? (
                    "↑"
                  ) : (
                    "↓"
                  )
                ) : (
                  ""
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3 text-center">
                  {item.id}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {item.name || "-"}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {item.room || "-"}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  {item.date || "-"}
                </td>
                <td className="border border-gray-200 p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}
                  >
                    {item.status || "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}