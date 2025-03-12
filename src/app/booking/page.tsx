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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking List</h1>

      {/* Card untuk Form Input */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Booking</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={newBooking.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Room</label>
            <input
              type="text"
              name="room"
              value={newBooking.room}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Enter room"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={newBooking.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={newBooking.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Booking
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Cari nama, ruangan, atau status..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset ke halaman pertama saat melakukan pencarian
        }}
        className="mb-4 p-2 border rounded w-full"
      />

      {/* Booking Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("id")}
            >
              ID {sortBy === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Nama {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("room")}
            >
              Ruangan {sortBy === "room" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("date")}
            >
              Tanggal {sortBy === "date" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th
              className="border p-2 cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status {sortBy === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.name || "-"}</td>
              <td className="border p-2">{item.room || "-"}</td>
              <td className="border p-2">{item.date || "-"}</td>
              <td className="border p-2">{item.status || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}