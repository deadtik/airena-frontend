// app/components/Header.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Gamepad2, Menu, X, User, ShieldCheck, Video } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const Header = () => {
  // Get all necessary values from the context, including the new roles
  const { user, logout, isSuperAdmin, isCreator, setIsModalOpen } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link href="/watch" className="hover:text-white transition-colors">
            Watch
          </Link>
          <Link href="/blogs" className="hover:text-white transition-colors">
            Blogs
          </Link>
          
          {/* --- THIS IS THE NEW LOGIC --- */}
          {/* Only render creator link if the user has the creator role */}
          {isCreator && (
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors">
              <Video size={16} /> My Dashboard
            </Link>
          )}
          
          {/* Only render admin link if the user is a SuperAdmin */}
          {isSuperAdmin && (
            <Link href="/admin/dashboard" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
              <ShieldCheck size={16} /> Admin Dashboard
            </Link>
          )}
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
                onClick={logout} // Use the logout function from the context
                className="bg-red-500/80 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 hover:shadow-lg transition-all text-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
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
            <Link href="/watch" className="hover:text-emerald-400 transition-colors">Watch</Link>
            <Link href="/blogs" className="hover:text-emerald-400 transition-colors">Blogs</Link>
            
            {/* Also add the conditional links to the mobile menu */}
            {isCreator && (
              <Link href="/dashboard" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                <Video size={16} /> My Dashboard
              </Link>
            )}
            {isSuperAdmin && (
              <Link href="/admin/dashboard" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
                <ShieldCheck size={16} /> Admin Dashboard
              </Link>
            )}

            <div className="w-full pt-4 border-t border-gray-700">
              {user ? (
                <button
                  onClick={logout}
                  className="w-full bg-red-500/80 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-emerald-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-emerald-600"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;