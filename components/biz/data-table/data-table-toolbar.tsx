"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"

export type FilterItem = {
  key: string
  title: string
  options: { value: string; label: string }[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters?: FilterItem[]
  viewOptions?: boolean
}

export function DataTableToolbar<TData>({
  table,
  filters,
  viewOptions = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          //value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={event=>{
              //table.getColumn("title")?.setFilterValue(event.target.value)
              console.log(event.target.value)
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {
          filters?.map((filter) => (
            <DataTableFacetedFilter
              key={filter.key}
              column={table.getColumn(filter.key)}
              title={filter.title}
              options={filter.options}
            />
          ))
        }
       
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {viewOptions && <DataTableViewOptions table={table} />}
    </div>
  )
}