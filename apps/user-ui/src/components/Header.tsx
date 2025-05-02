"use client";

import Link from "next/link";
import { HeartIcon, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import HeaderBottom from "./HeaderBottom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto w-[90%] py-4 flex items-center justify-between gap-4 relative">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold text-rose-500 tracking-wide"
        >
          Velveta
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:block w-full max-w-[600px] relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products"
            className="w-full h-[48px] px-4 pr-16 rounded-md border-2 border-rose-200 focus:ring-2 focus:ring-rose-400 outline-none transition placeholder:text-sm"
          />
          <button className="absolute right-0 top-0 h-full w-[48px] flex items-center justify-center bg-rose-500 hover:bg-rose-600 rounded-r-md">
            <Search size={20} color="white" />
          </button>
        </div>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Account */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="w-[42px] h-[42px] flex items-center justify-center border border-gray-300 rounded-full"
            >
              <User size={20} />
            </Link>
            <div className="leading-tight text-sm">
              <span className="block text-gray-500">Hello,</span>
              <span className="font-semibold text-gray-800">Sign In</span>
            </div>
          </div>

          {/* Wishlist */}
          <Link href="/whislist" className="relative">
            <HeartIcon />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
              0
            </div>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingBag />
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
              0
            </div>
          </Link>
        </div>

        {/* Mobile Search Button */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="p-2 rounded-md border border-gray-300"
          >
            {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products"
              className="w-full h-[48px] px-4 pr-16 rounded-md border-2 border-rose-200 focus:ring-2 focus:ring-rose-400 outline-none transition placeholder:text-sm"
            />
            <button className="absolute right-0 top-0 h-full w-[48px] flex items-center justify-center bg-rose-500 hover:bg-rose-600 rounded-r-md">
              <Search size={20} color="white" />
            </button>
          </div>
        </div>
      )}

      {/* Header Bottom Navigation */}
      <HeaderBottom />
    </div>
  );
};

export default Header;
