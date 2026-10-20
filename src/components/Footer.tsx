import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-8 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h2 className="text-xl font-bold">AnimeExplorer</h2>
            <p className="text-sm text-gray-400">Your go-to place for anime reviews and updates.</p>
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} AnimeExplorer. All rights reserved.
          </p>

          <div className="flex space-x-4" aria-hidden="true">
            <FaFacebook size={24} className="text-blue-500" />
            <FaTwitter size={24} className="text-blue-400" />
            <FaInstagram size={24} className="text-pink-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
