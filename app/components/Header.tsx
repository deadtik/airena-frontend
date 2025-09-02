// app/components/Header.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Gamepad2, Menu, X, User } from "lucide-react";
import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";
import { useAuth } from "@/app/context/AuthContext";

const Header = () => {
  // Correctly get user and the global modal state function from the context
  const { user, setIsModalOpen } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <header className="py-4 px-6 sm:px-10 lg:px-16 fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-widest flex items-center gap-2 cursor-pointer text-white hover:text-emerald-400 transition-colors"
        >
          <Gamepad2 size={28} /> AIRENA
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10 font-medium text-gray-300">
          <Link href="#" className="hover:text-white transition-colors">
            Browser
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Categories
          </Link>
          <Link href="/blogs" className="hover:text-white transition-colors">
            Blogs
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-5">
              <span className="text-sm text-gray-300 flex items-center gap-2 font-medium">
                <User size={16} />{" "}
                {user.displayName || user.email || user.phoneNumber}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-500/80 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 hover:shadow-lg transition-all text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              // This now calls the function from the context to open the modal
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-600 hover:shadow-lg transition-all transform hover:scale-105"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="text-white hover:text-emerald-400 transition-colors"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-black/95 rounded-xl shadow-lg border border-gray-800">
          <nav className="flex flex-col items-start p-6 space-y-5 text-gray-300 font-medium">
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Browser
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Categories
            </Link>
            <Link href="/blogs" className="hover:text-emerald-400 transition-colors">
              Blogs
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="w-full bg-red-500/80 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 hover:shadow-lg transition-all"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMenuOpen(false); // Close menu when opening modal
                }}
                className="w-full bg-emerald-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-emerald-600 hover:shadow-lg transition-all"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;