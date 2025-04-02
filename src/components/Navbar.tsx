"use client";
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-3xl ml-20 font-bold tracking-wide text-white hover:text-gray-300 transition">
          AnimeExplorer
        </Link>

        <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        <div className={`md:flex gap-8 ${isOpen ? "block" : "hidden"} absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent p-4 md:p-0`}>
          <Link href="/" className="block md:inline-block text-lg font-medium hover:text-gray-300 transition px-4 py-2">
            Home
          </Link>
          <Link href="/popular" className="block md:inline-block text-lg font-medium hover:text-gray-300 transition px-4 py-2">
            Popular
          </Link>
          <Link href="/editors" className="block md:inline-block text-lg font-medium hover:text-gray-300 transition px-4 py-2">
            Editors Pick
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
