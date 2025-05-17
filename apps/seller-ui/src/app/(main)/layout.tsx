"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar, menuGroups } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Helper function to get breadcrumb title from nav data
const getBreadcrumbTitle = (path: string) => {
  const allItems = menuGroups.flatMap((group) => group.items);
  const foundItem = allItems.find((item) => item.url === path);

  return foundItem
    ? foundItem.title
    : path.charAt(0).toUpperCase() + path.slice(1);
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const currentPath = `/${pathSegments.join("/")}`;
  const pageTitle = getBreadcrumbTitle(currentPath);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="pt-4">
          {/* Title and Trigger */}
          <div className="flex items-center gap-3 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <h1 className="text-2xl font-semibold tracking-tight">
              {pageTitle}
            </h1>
          </div>

          {/* Breadcrumb aligned with title */}
          <div className="ml-12 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Seller</BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathSegments.length - 1;
                  const breadcrumbTitle = getBreadcrumbTitle(href);

                  return (
                    <div key={href} className="flex items-center">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{breadcrumbTitle}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>
                            {breadcrumbTitle}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
