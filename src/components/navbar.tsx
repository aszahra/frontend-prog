"use client";

// components/Navbar.js
import React, { useState } from "react";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-lg font-bold">
              Aisyah's Aplikasi
            </a>
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-4">
            <a href="/dashboard" className="hover:bg-gray-700 px-3 py-2 rounded">
              Dashboard
            </a>
            <a href="/room" className="hover:bg-gray-700 px-3 py-2 rounded">
              Room
            </a>
            <a href="/user" className="hover:bg-gray-700 px-3 py-2 rounded">
              User
            </a>
            <a href="/booking" className="hover:bg-gray-700 px-3 py-2 rounded">
              Booking
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;