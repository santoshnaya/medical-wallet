import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { Heart, Stethoscope, FileText, Info } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ChatBot from '@/components/ChatBot';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medical Wallet",
  description: "Your personal medical records management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Sidebar />
        {/* Navbar */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">Medical Wallet</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-8">
                <Link href="/features" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <Heart className="h-5 w-5" />
                  <span>Features</span>
                </Link>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <FileText className="h-5 w-5" />
                  <span>Blog</span>
                </Link>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <Link href="/" className="flex items-center space-x-2">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-bold text-gray-900">Medical Wallet</span>
                </Link>
                <p className="text-gray-500 text-sm">
                  Your personal medical records management system. Secure, accessible, and always with you.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Features</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/features#secure" className="text-gray-500 hover:text-gray-900">
                      Secure Storage
                    </Link>
                  </li>
                  <li>
                    <Link href="/features#qr" className="text-gray-500 hover:text-gray-900">
                      QR Code Access
                    </Link>
                  </li>
                  <li>
                    <Link href="/features#emergency" className="text-gray-500 hover:text-gray-900">
                      Emergency Access
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-gray-500 hover:text-gray-900">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-gray-500 hover:text-gray-900">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
                <ul className="mt-4 space-y-4">
                  <li className="text-gray-500">
                    support@medicalwallet.com
                  </li>
                  <li className="text-gray-500">
                    +1 (555) 123-4567
                  </li>
                  <li className="text-gray-500">
                    123 Medical Street<br />
                    Health City, HC 12345
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-gray-500 text-sm text-center">
                © {new Date().getFullYear()} Medical Wallet. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
        <ChatBot />
      </body>
    </html>
  );
}
