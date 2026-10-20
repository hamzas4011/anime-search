"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/popular", label: "Popular" },
  { href: "/editors", label: "Editors Pick" },
  { href: "/ask", label: "AI Picks", icon: "🤖" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <nav aria-label="Main" className="relative z-40 bg-gray-950 text-white shadow-lg border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center px-4 py-3 md:py-4">
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="text-2xl md:text-3xl font-bold tracking-wide text-white hover:text-gray-300 transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          AnimeExplorer
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="main-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden flex items-center justify-center w-11 h-11 text-2xl text-white rounded hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <span aria-hidden="true">{isOpen ? "✕" : "☰"}</span>
        </button>

        <ul
          id="main-menu"
          className={`md:flex md:gap-4 lg:gap-8 max-md:absolute max-md:top-full max-md:inset-x-4 max-md:mt-2 max-md:rounded-xl max-md:border max-md:border-gray-800 max-md:bg-gray-950 max-md:shadow-lg max-md:p-2 max-md:transition-all max-md:duration-300 max-md:ease-out motion-reduce:transition-none ${
            isOpen
              ? "max-md:visible max-md:opacity-100 max-md:translate-y-0"
              : "max-md:invisible max-md:opacity-0 max-md:-translate-y-4"
          }`}
        >
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block text-lg font-medium px-4 py-3 md:py-2 rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    active ? "text-blue-400" : "hover:text-gray-300 hover:bg-gray-800 md:hover:bg-transparent"
                  }`}
                >
                  {link.icon && <span aria-hidden="true">{link.icon} </span>}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
