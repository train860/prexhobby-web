"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { DataTableColumnHeader } from "@/components/biz/data-table/data-table-column-header"
import { DataTableRowActions } from "@/components/biz/data-table/data-table-row-actions"
import Link from "next/link"
import CustomImage from "@/components/biz/custom-image"
import { format } from "date-fns"
import { TColumn } from "@/components/biz/data-table"
export type OrderItem = {
  id: string;
  width?: number;
  canAddToCart?: boolean;
  title: string;
  line_items: any[];
  createdAt: string;
  total_price: string;
  shipping_address: any;
  skuStatus?: any;
}
export const columns: TColumn<OrderItem,unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className={`translate-y-[2px]`}
      />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "sku",
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => row.getValue("sku"),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "barcode",
    accessorKey: "barcode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Barcode" />
    ),
    cell: ({ row }) => row.getValue("barcode"),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <Link target="_blank" href={`https://admin.shopify.com/store/aot-supply/products/${row.original.id}`} className="underline underline-offset-4">
          {row.original.title}
        </Link>
      )
    },
    enableSorting: false,
  },
  
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "MMM dd, yyyy")
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  
]