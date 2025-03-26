"use client";

import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            asz's app
          </div>

          {/* Menu */}
          <div className="hidden md:flex space-x-6">
            {["Dashboard", "Room", "User", "Booking"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="relative inline-block group px-4 py-2 rounded-md transition duration-300 hover:bg-white/20"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-200 focus:outline-none transition duration-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-16 6h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white border-t border-gray-200 shadow-lg`}
      >
        {["Dashboard", "Room", "User", "Booking"].map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase()}`}
            className="block px-4 py-3 text-gray-900 hover:bg-blue-100 transition duration-300"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;