"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  ChevronDown,
  HeartIcon,
  ShoppingBag,
  User,
  Menu,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems } from "../constants";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import useUser from "@/src/hooks/useUser";

const HeaderBottom = () => {
  const { user } = useUser();
  const [showCategories, setShowCategories] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = ["Fruits", "Vegetables", "Seeds", "Tools", "Fertilizers"];

  return (
    <div
      className={`w-full z-50 transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 bg-white shadow-md" : "relative"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4 relative">
        {/* Desktop: All Departments Dropdown */}
        <div className="relative hidden md:flex" ref={dropdownRef}>
          <div
            onClick={() => setShowCategories((prev) => !prev)}
            className="w-[260px] h-[50px] bg-rose-500 text-white rounded-md flex items-center justify-between px-4 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <AlignLeft size={20} />
              <span className="text-sm font-medium">All Departments</span>
            </div>
            <ChevronDown size={18} />
          </div>

          <AnimatePresence>
            {showCategories && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[48px] left-0 w-[260px] max-h-[400px] overflow-y-auto bg-white border border-rose-100 shadow-xl rounded-md z-50"
              >
                <ul className="divide-y divide-rose-100">
                  {categories.map((cat, index) => (
                    <li key={index}>
                      <Link
                        href={`/category/${cat.toLowerCase()}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-500 transition"
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: Navigation Links */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-rose-500 transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Mobile Menu with Sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md bg-rose-500 text-white">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 bg-white p-4 border-r border-gray-200 shadow-lg flex flex-col justify-between"
            >
              <div>
                <SheetHeader>
                  <SheetTitle className="text-lg font-semibold text-rose-500 mb-4">
                    Menu
                  </SheetTitle>
                </SheetHeader>

                {/* Department Links */}
                <SheetTitle className="text-sm font-semibold text-rose-500 mb-2">
                  All Departments
                </SheetTitle>

                <ul className="space-y-2 mb-6">
                  {categories.map((cat, index) => (
                    <li key={index}>
                      <Link
                        href={`/category/${cat.toLowerCase()}`}
                        className="block text-sm text-gray-700 hover:text-rose-500"
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Navigation Links */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="block text-sm text-gray-700 hover:text-rose-500"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom Icons with Labels */}
              <div className="pt-6 mt-6 border-t border-gray-200 flex flex-col gap-5">
                <Link
                  href={user ? "/profile" : "/login"}
                  className="flex items-center gap-3 text-gray-700 hover:text-rose-500"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {user ? user.name : "Login"}
                  </span>
                </Link>

                <Link
                  href="/whislist"
                  className="flex items-center gap-3 relative text-gray-700 hover:text-rose-500"
                >
                  <HeartIcon size={20} />
                  <span className="text-sm font-medium">Wishlist</span>
                  <span className="absolute left-5 top-[-6px] w-4 h-4 bg-rose-500 text-white text-xs flex items-center justify-center rounded-full border border-white">
                    0
                  </span>
                </Link>

                <Link
                  href="/cart"
                  className="flex items-center gap-3 relative text-gray-700 hover:text-rose-500"
                >
                  <ShoppingBag size={20} />
                  <span className="text-sm font-medium">Cart</span>
                  <span className="absolute left-5 top-[-6px] w-4 h-4 bg-rose-500 text-white text-xs flex items-center justify-center rounded-full border border-white">
                    0
                  </span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
