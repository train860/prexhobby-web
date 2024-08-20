"use client"
import DataTable, { TableRef } from "@/components/biz/data-table"
import { OrderItem, columns } from "./components/columns"
import { products } from "@/apis/product"
import Page from "@/components/biz/page"
import CustomCard from "@/components/biz/custom-card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { addDays, format, set } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Suspense, useRef, useState } from "react"
import { DateRange } from "react-day-picker"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx";
export default function Orders() {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const tableRef = useRef<TableRef>(null)
  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [search, setSearch] = useState('')
  const selectedRows = useRef<Record<string, any>>({});
  const [variables, setVariables] = useState<any>({
    startDate: date?.from ? format(date?.from!, 'yyyy-MM-dd') : undefined,
    endDate: date?.to ? format(date?.to!, 'yyyy-MM-dd') : undefined,
  })
  const { data, isLoading, refetch } = useQuery<any>({
    queryKey: ["products", variables],
    queryFn: () => products(variables),
    staleTime: 0,
  })
  const handleUpdateSelectedRows = () => {
    const selection = tableRef.current?.rowSelection() || {};
    const keys: string[] = Object.keys(selection);
    const rows: Record<string, any> = {};
    data?.content.forEach((item: any) => {
      const key = item.id;
      if (keys.includes(key)) {
        rows[key] = item;
      }
    });
    selectedRows.current = {
      ...selectedRows.current,
      ...rows,
    }
  }
  const handleDownload = () => {
    const selection = tableRef.current?.rowSelection() || {};
    const keys: string[] = Object.keys(selection);
    const rows: any[] = [];

    let mItems:any[] = data?.content || [];
    const list=Object.values(selectedRows.current) ||[]
    mItems=mItems.concat(list)
    const mIds:string[]=[]

    mItems.forEach((item: any) => {
      const key = String(item.id);
      if(mIds.includes(key)){
        return
      }
      if (keys.includes(key)) {
        rows.push({
          "Name": item.title,
          "Name in French":"",
          "SKU": item.sku,
          "Barcode (UPC / FNSKU)": item.barcode,
          "Catalog": "Shopify",
          "Pieces/Carton":  "",
          "Price":  "",
        });
        mIds.push(key)
      }
    });

    if (!rows?.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No data to export!",
      });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Name",
          "Name in French",
          "SKU",
          "Barcode (UPC / FNSKU)",
          "Catalog",
          "Pieces/Carton",
          "Price",
        ],
      ],
      { origin: "A1" }
    );
    XLSX.writeFile(workbook, `product-request.csv`, { compression: true });
  }
  const toolbar = (
    <div className="flex items-center gap-4">
      <DatePickerWithRange  value={date} onChange={(value) => {
        setDate(value)
      }} />
      <Input type="text" placeholder="Search" value={search} onChange={(e) => {
        setSearch(e.target.value)
      }} />
      <Button type="button" loading={isLoading} size="sm" onClick={() => {
        
        const vars:any ={
          ts: new Date().getTime(),
          query:search
        }
        if(date && date.from){
          vars.startDate= format(date.from, 'yyyy-MM-dd')
        }
        if(date && data.to){
          vars.endDate=format(date.to!, 'yyyy-MM-dd')
        }
        handleUpdateSelectedRows()
        setVariables({
          ...vars
        })
      }}>Search</Button>
      <Button type="button" variant={'destructive'} size="sm" onClick={() => {
        handleDownload()
      }}>Download excel</Button>
    </div>
  )
  return (
    <Page title="Products" className="max-w-full">
      <CustomCard>
      <Suspense>
        <DataTable<OrderItem,unknown>
          ref={tableRef}
          queryKey="products"
          columns={columns}
          pagination={false}
          data={data?.content || []}
          toolbar={toolbar}
          onSelectionClear={() => {
            selectedRows.current = {};
          }}
          selection={
            {
              enabled: true,
            }
          } />
      </Suspense>
      </CustomCard>
    </Page>
  )
}