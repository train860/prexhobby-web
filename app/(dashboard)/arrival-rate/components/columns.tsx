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
  rate?: number;
  name: string;
  line_items: any[];
  created_at: string;
  total_price: string;
  shipping_address: any;
}
export const columns: TColumn<OrderItem,unknown>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <Link target="_blank" href={`https://admin.shopify.com/store/aot-supply/orders/${row.original.id}`} className="underline underline-offset-4">
          {row.original.name}
        </Link>
      )
    },
    enableSorting: false,
  },
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => row.getValue("id"),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "created_at",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.original.created_at), "MMM dd, yyyy")
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "total_price",
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      return row.original.total_price
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "items",
    accessorKey: "items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => {
      return(
        <>
          <h3 className="text-red-500">Total:{row.original.line_items.length} items</h3>
          {
            row.original.line_items.map((item:any)=>{
              return(
                <div key={item.sku} className="flex items-center gap-2">
                  <p>{item.sku}x{item.quantity}</p>
                </div>
              )
            })
          
          }
        </>
      ) 
    },
    enableSorting: false,
  },
  {
    id: "shipping_address",
    accessorKey: "destination",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Destination" />
    ),
    cell: ({ row }) => {
      const address=row.original.shipping_address
      if (!address) return ''
      return `${address.city},${address.province}, ${address.country}`
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "rate",
    accessorKey: "rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Arrival Rate" />
    ),
    cell: ({ row }) => {
      const rate=Number((row.original.rate ||0) * 100)
      if (rate>=65){
        return (
          <Badge variant="success">{rate.toFixed(0)}%</Badge>
        )
      }
      return (
        <Badge variant="secondary">{rate.toFixed(0)}%</Badge>
      )
    },
    enableSorting: true,
  },
]