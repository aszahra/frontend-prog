"use client";

import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-xl font-bold tracking-wide">Aisyah's Aplikasi</div>

          {/* Menu */}
          <div className="hidden md:flex space-x-6">
            <a href="/dashboard" className="hover:text-gray-400 transition">Dashboard</a>
            <a href="/room" className="hover:text-gray-400 transition">Room</a>
            <a href="/user" className="hover:text-gray-400 transition">User</a>
            <a href="/booking" className="hover:text-gray-400 transition">Booking</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-16 6h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <a href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Dashboard</a>
          <a href="/room" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Room</a>
          <a href="/user" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">User</a>
          <a href="/booking" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Booking</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
