"use client";

import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          AnimeSearch
        </Link>
        <button
          className="md:hidden block focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <div className={`md:flex gap-6 ${isOpen ? "block" : "hidden"}`}>
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/popular" className="hover:text-gray-300">Popular</Link>
          <Link href="/genres" className="hover:text-gray-300">Genres</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
