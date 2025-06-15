"use client";

import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  X,
  Menu,
  ChevronDown,
  Package,
} from "lucide-react";
import useUser from "../../../hooks/useUser";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.png";
// Mock data and hooks for demo

const navItems = [
  { title: "Home", href: "/" },
  { title: "Products", href: "/products" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

const categories = ["Fruits", "Vegetables", "Seeds", "Tools", "Fertilizers"];

const Header = () => {
  const { user, isLoading } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLDivElement).contains(event.target as Node)
      ) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={`w-full transition-all duration-500 ease-in-out ${
          isSticky
            ? "fixed top-0 left-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100"
            : "relative bg-gradient-to-r from-white via-blue-50/30 to-white border-b border-blue-100"
        }`}
      >
        {/* Main Header Content */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative">
                <Image src={Logo} alt="Logo" />
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <div onSubmit={handleSearch} className="relative group">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for fresh products..."
                    className="w-full h-12 pl-4 pr-14 rounded-full border-2 border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 placeholder:text-gray-400 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Search size={18} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center gap-6">
              {/* User Account */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <div className="w-10 h-10 flex items-center justify-center border-2 border-blue-200 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:border-blue-400 transition-all duration-300 group-hover:shadow-md">
                    <User size={18} className="text-blue-600" />
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-500 text-xs">Hello,</div>
                  <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {!isLoading && user ? (
                      user.name
                    ) : (
                      <Link href={"/login"}>Sign In</Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Wishlist */}
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 group-hover:shadow-md">
                  <Heart
                    size={20}
                    className="text-blue-600 group-hover:text-blue-700 transition-colors"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  0
                </div>
              </div>

              {/* Cart */}
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 group-hover:shadow-md">
                  <ShoppingBag
                    size={20}
                    className="text-blue-600 group-hover:text-blue-700 transition-colors"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  0
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden mt-4">
            <div onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for fresh products..."
                className="w-full h-12 pl-4 pr-14 rounded-full border-2 border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="absolute right-1 top-1 h-10 w-10 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              >
                <Search size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="hidden md:block border-t border-blue-100 bg-white/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Categories Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Package size={18} />
                  <span className="font-medium">All Departments</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      showCategories ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Categories Dropdown */}
                <div
                  className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden transition-all duration-300 z-50 ${
                    showCategories
                      ? "opacity-100 visible transform scale-100"
                      : "opacity-0 invisible transform scale-95"
                  }`}
                >
                  <div className="py-2">
                    {categories.map((category, index) => (
                      <a
                        key={index}
                        href={`/category/${category.toLowerCase()}`}
                        className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 transition-all duration-200 border-l-4 border-transparent hover:border-blue-400"
                      >
                        {category}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center gap-8">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="relative font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 group py-2"
                  >
                    {item.title}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>

        <div
          className={`absolute top-0 left-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Menu
              </h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-blue-600 mb-4 uppercase tracking-wide">
                Departments
              </h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <a
                    key={index}
                    href={`/category/${category.toLowerCase()}`}
                    className="block py-2 px-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    {category}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-blue-600 mb-4 uppercase tracking-wide">
                Navigation
              </h3>
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="block py-2 px-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <a
                href={user ? "/profile" : "/login"}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">
                  {user ? user.name : "Login"}
                </span>
              </a>

              <a
                href="/wishlist"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors relative"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                  <Heart size={16} className="text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">Wishlist</span>
                <div className="absolute left-8 top-2 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </div>
              </a>

              <a
                href="/cart"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors relative"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                  <ShoppingBag size={16} className="text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">Cart</span>
                <div className="absolute left-8 top-2 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky spacer */}
      {isSticky && <div className="h-32"></div>}
    </>
  );
};

export default Header;
