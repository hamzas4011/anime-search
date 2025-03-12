import Navbar from "../components/Navbar";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
