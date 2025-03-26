"use client"; // Untuk menggunakan Client Components (React hooks)

// Import dependencies
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import CSS untuk react-calendar

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  // Data dummy untuk statistik utama
  const statsData = {
    totalBookings: 45,
    availableRooms: 8,
    monthlyRevenue: "Rp200.000.000",
    totalUsers: 500,
  };

  // Data dummy untuk grafik pemesanan
  const bookingChartData = {
    labels: ["1 Mar", "8 Mar", "15 Mar", "22 Mar", "29 Mar"],
    datasets: [
      {
        label: "Pemesanan Harian",
        data: [10, 15, 20, 18, 25],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data dummy untuk grafik pendapatan
  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Pendapatan Bulanan",
        data: [100000, 150000, 200000, 250000, 300000],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data dummy untuk tabel pemesanan terbaru
  const recentBookings = [
    { id: 1, user: "John Doe", room: "Room A", date: "1 Mar 2025" },
    { id: 2, user: "Jane Smith", room: "Room B", date: "5 Mar 2025" },
    { id: 3, user: "Alice Johnson", room: "Room C", date: "10 Mar 2025" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Container Utama */}
      <div className="max-w-[85rem] mx-auto space-y-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-3">Selamat Datang di Aplikasi ASZ!</p>
        </div>

        {/* Statistik Utama */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Pemesanan */}
          <div className="p-6 text-center border rounded-lg bg-green-100">
            <h2 className="text-xl font-bold text-green-800">Total Pemesanan</h2>
            <p className="text-3xl font-bold text-green-900 mt-2">
              {statsData.totalBookings}
            </p>
          </div>

          {/* Ruangan Tersedia */}
          <div className="p-6 text-center border rounded-lg bg-blue-100">
            <h2 className="text-xl font-bold text-blue-800">Ruangan Tersedia</h2>
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {statsData.availableRooms}
            </p>
          </div>

          {/* Pendapatan Bulanan */}
          <div className="p-6 text-center border rounded-lg bg-purple-100">
            <h2 className="text-xl font-bold text-purple-800">Pendapatan Bulanan</h2>
            <p className="text-3xl font-bold text-purple-900 mt-2">
              {statsData.monthlyRevenue}
            </p>
          </div>

          {/* Total Pengguna */}
          <div className="p-6 text-center border rounded-lg bg-yellow-100">
            <h2 className="text-xl font-bold text-yellow-800">Total Pengguna</h2>
            <p className="text-3xl font-bold text-yellow-900 mt-2">
              {statsData.totalUsers}
            </p>
          </div>
        </div>

        {/* Grafik Pemesanan */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Grafik Pemesanan</h2>
          <div className="h-96">
            <Bar
              data={bookingChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Grafik Pendapatan */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Grafik Pendapatan</h2>
          <div className="h-96">
            <Bar
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Kalender dan Tabel Pemesanan Terbaru */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Kalender Ketersediaan */}
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Kalender Ketersediaan
            </h2>
            <Calendar
              onChange={setDate}
              value={date}
              className="rounded-lg shadow-md"
            />
            <p className="mt-4 text-gray-600">
              Tanggal dipilih: {date.toDateString()}
            </p>
          </div>

          {/* Tabel Pemesanan Terbaru */}
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Pemesanan Terbaru
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Room
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;