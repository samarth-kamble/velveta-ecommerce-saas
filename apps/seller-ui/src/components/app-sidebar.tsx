"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  MessageCircle,
  Command,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const menuGroups = [
  {
    heading: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    heading: "Store Management",
    items: [
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ShoppingCart,
      },
      {
        title: "Products",
        url: "/dashboard/products",
        icon: Package,
      },
      {
        title: "Inventory",
        url: "/dashboard/inventory",
        icon: BarChart3,
      },
    ],
  },
  {
    heading: "Support & Settings",
    items: [
      {
        title: "Messages",
        url: "/dashboard/messages",
        icon: MessageCircle,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="inset"
      className="w-64 border-r dark:border-gray-800 bg-white dark:bg-gray-900"
      {...props}
    >
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-3 p-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white">
                  <Command className="size-6" />
                </div>
                <div className="text-left leading-tight">
                  <h1 className="text-xl font-bold tracking-wide">Velveta</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Seller Panel
                  </p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarMenu key={group.heading} className="mt-6">
            <p className="px-5 pb-2 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
              {group.heading}
            </p>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all",
                      pathname === item.url
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-7 transition-transform",
                        pathname === item.url
                          ? "text-rose-500"
                          : "group-hover:scale-110"
                      )}
                    />
                    <span className="text-lg font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t dark:border-gray-800 p-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
