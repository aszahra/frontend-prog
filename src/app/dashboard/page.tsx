"use client";

// app/dashboard/page.tsx
import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Data dummy untuk card
  const cardData = {
    bookings: 12,
    availableRooms: 5,
    revenue: "Rp100.500.000",
  };

  // Data dummy untuk grafik transaksi
  const transactionData = {
    labels: ["1 Mar", "8 Mar", "15 Mar", "22 Mar", "29 Mar"],
    datasets: [
      {
        label: "Transaksi",
        data: [200, 250, 300, 400, 350],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Data dummy untuk tabel
  const tableData = [
    { id: 1, date: "1 Mar 2025", room: "Room A", amount: "$100" },
    { id: 2, date: "5 Mar 2025", room: "Room B", amount: "$150" },
    { id: 3, date: "10 Mar 2025", room: "Room C", amount: "$200" },
    { id: 4, date: "15 Mar 2025", room: "Room D", amount: "$120" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Booking Masuk */}
        <div className="bg-green-100 shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-green-800">Booking Masuk</h2>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {cardData.bookings}
          </p>
        </div>

        {/* Card 2: Ruangan Tersedia */}
        <div className="bg-blue-100 shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-blue-800">Ruangan Tersedia</h2>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            {cardData.availableRooms}
          </p>
        </div>

        {/* Card 3: Pemasukan */}
        <div className="bg-purple-100 shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-purple-800">Pemasukan</h2>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {cardData.revenue}
          </p>
        </div>
      </div>

      {/* Grafik Transaksi */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Grafik Transaksi - Maret 2025
        </h2>
        {/* Mengatur ukuran grafik */}
        <div className="max-w-full h-64">
          <Bar
            data={transactionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false, // Menyembunyikan legenda jika tidak diperlukan
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false, // Menghilangkan garis grid di sumbu x
                  },
                },
                y: {
                  grid: {
                    display: false, // Menghilangkan garis grid di sumbu y
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
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
                Amount
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {tableData.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.room}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;