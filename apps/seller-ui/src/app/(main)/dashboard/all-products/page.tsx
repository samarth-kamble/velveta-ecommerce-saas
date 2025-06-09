"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  Eye,
  Pencil,
  Star,
  Trash,
  Search,
  MoreHorizontal,
  Package,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

interface Product {
  id: string;
  title: string;
  slug: string;
  image: string;
  sale_price: number;
  stock: number;
  category: string;
  ratings?: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get("/product/api/get-shop-products");
  return res?.data?.products || [];
};

const AllProductPage = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const queryClient = useQueryClient();

  const {
    data: products = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["shop-products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }: any) => (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={row.original.images[0]?.url}
              alt={row.original.title || "Product image"}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: "Product Name",
        cell: ({ row }: any) => {
          const title = row.original.title || "Untitled Product";
          const truncateTitle =
            title.length > 30 ? `${title.substring(0, 30)}...` : title;

          return (
            <div className="space-y-1">
              <Link
                href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
                className="font-medium text-gray-900 hover:text-rose-600 transition-colors flex items-center gap-1 group"
              >
                {truncateTitle}
                <ExternalLink
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
              <p className="text-sm text-gray-500">#{row.original.id}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "sale_price",
        header: "Price",
        cell: ({ row }: any) => (
          <div className="font-semibold text-gray-900">
            ${row.original.sale_price?.toFixed(2) || "0.00"}
          </div>
        ),
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ row }: any) => {
          const stock = row.original.stock || 0;
          const isLowStock = stock < 10;
          const isOutOfStock = stock === 0;

          return (
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  isOutOfStock
                    ? "destructive"
                    : isLowStock
                    ? "outline"
                    : "secondary"
                }
                className={
                  isOutOfStock
                    ? "bg-red-100 text-red-800 border-red-200"
                    : isLowStock
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-green-100 text-green-800 border-green-200"
                }
              >
                {isOutOfStock ? "Out of Stock" : `${stock} left`}
              </Badge>
              {isLowStock && !isOutOfStock && (
                <AlertTriangle size={16} className="text-yellow-500" />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }: any) => (
          <Badge
            variant="outline"
            className="bg-rose-50 text-rose-700 border-rose-200"
          >
            {row.original.category || "Uncategorized"}
          </Badge>
        ),
      },
      {
        accessorKey: "ratings",
        header: "Rating",
        cell: ({ row }: any) => {
          const rating = row.original.ratings || 0;
          return (
            <div className="flex items-center gap-1">
              <Star fill="#fbbf24" className="text-yellow-400" size={16} />
              <span className="font-medium text-gray-700">
                {rating.toFixed(1)}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: any) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/product/${row.original.id}`}
                  className="flex items-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/product/edit/${row.original.id}`}
                  className="flex items-center gap-2"
                >
                  <Pencil size={16} />
                  Edit Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProduct(row.original);
                  setShowAnalytics(true);
                }}
                className="flex items-center gap-2"
              >
                <BarChart size={16} />
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedProduct(row.original);
                  setShowDeleteModal(true);
                }}
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
              >
                <Trash size={16} />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      // Add your delete API call here
      // await axiosInstance.delete(`/products/api/delete-product/${selectedProduct.id}`);

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });

      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="w-full min-h-screen p-8 bg-gray-50">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full min-h-screen p-8 bg-gray-50">
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load products. Please try again later.
                {error instanceof Error && (
                  <div className="mt-2 text-sm text-gray-600">
                    Error: {error.message}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your product inventory ({products.length} total)
            </p>
          </div>
          <Button
            className="bg-rose-600 hover:bg-rose-700"
            onClick={() => (window.location.href = "/dashboard/create-product")}
          >
            <Package className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-rose-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {products.filter((p) => p.stock < 10 && p.stock > 0).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {products.filter((p) => p.stock === 0).length}
                  </p>
                </div>
                <Trash className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {products.length > 0
                      ? (
                          products.reduce(
                            (acc, p) => acc + (p.ratings || 0),
                            0
                          ) / products.length
                        ).toFixed(1)
                      : "0.0"}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-gray-50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}{" "}
                to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedProduct?.title}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Analytics Dialog */}
        {showAnalytics && (
          <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
            <DialogContent className="max-w-2xl z-50">
              <DialogHeader>
                <DialogTitle>Product Analytics</DialogTitle>
                <DialogDescription>
                  Analytics for "{selectedProduct?.title}"
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Views</p>
                          <p className="text-2xl font-bold">1,234</p>
                        </div>
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Sales</p>
                          <p className="text-2xl font-bold">56</p>
                        </div>
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setShowAnalytics(false);
                    setSelectedProduct(null);
                  }}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AllProductPage;
