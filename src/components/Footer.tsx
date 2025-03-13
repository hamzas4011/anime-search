import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">AnimeWorld</h2>
            <p className="text-sm text-gray-400">Your go-to place for anime reviews and updates.</p>
          </div>

          <nav className="flex space-x-6">
            <Link href="/contact" className="hover:text-gray-400">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-gray-400">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-gray-400">Terms of Service</Link>
          </nav>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <FaFacebook size={24} className="text-blue-500 cursor-pointer" />
            <FaTwitter size={24} className="text-blue-400 cursor-pointer" />
            <FaInstagram size={24} className="text-pink-500 cursor-pointer" />
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} AnimeExplorer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
