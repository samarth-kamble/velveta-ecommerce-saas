"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Command,
  CircleDollarSign,
  Boxes,
  Calendar,
  Mail,
  Settings,
  BellRing,
  CalendarDays,
  Percent,
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
import useSeller from "@/hooks/useSeller";

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
        title: "Payments",
        url: "/dashboard/payments",
        icon: CircleDollarSign,
      },
    ],
  },
  {
    heading: "Products",
    items: [
      {
        title: "Create Product",
        url: "/dashboard/create-product",
        icon: Package,
      },
      {
        title: "All Products",
        url: "/dashboard/all-products",
        icon: Boxes,
      },
    ],
  },
  {
    heading: "Events",
    items: [
      {
        title: "Create Event",
        url: "/dashboard/create-event",
        icon: Calendar,
      },
      {
        title: "All Events",
        url: "/dashboard/all-events",
        icon: CalendarDays,
      },
    ],
  },
  {
    heading: "Controllers",
    items: [
      {
        title: "Inbox",
        url: "/dashboard/inbox",
        icon: Mail,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: BellRing,
      },
    ],
  },
  {
    heading: "Extras",
    items: [
      {
        title: "Discount Codes",
        url: "/dashboard/discount-codes",
        icon: Percent,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { seller } = useSeller();
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
                    {seller?.shop?.name}
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
          <SidebarMenu key={group.heading} className="mt-4">
            <p className="px-5 pb-1 text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">
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
                        "size-4 transition-transform",
                        pathname === item.url
                          ? "text-rose-500"
                          : "group-hover:scale-110"
                      )}
                    />
                    <span className="text-md font-medium">{item.title}</span>
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
