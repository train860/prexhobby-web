"use client"
import DataTable, { TableRef } from "@/components/biz/data-table"
import { OrderItem, columns } from "./components/columns"
import { invoice } from "@/apis/invoice"
import Page from "@/components/biz/page"
import CustomCard from "@/components/biz/custom-card"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { addDays, format, set } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Suspense, useMemo, useRef, useState } from "react"
import { DateRange } from "react-day-picker"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import * as XLSX from "xlsx"

function Invoice() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const tableRef = useRef<TableRef>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const defaultVariables = useMemo(() => {
        const vars: Record<string, any> = {}
        const keys = Array.from(searchParams.keys());
        keys.forEach(k => {
            vars[k] = searchParams.get(k)
        })
        return {
            ...vars,
        }
    }, [])
    const [variables, setVariables] = useState(defaultVariables)
    const { data, isLoading, refetch } = useQuery<any>({
        queryKey: ["invoice", variables],
        queryFn: () => invoice(variables),
        enabled: !!variables.orderId,
        staleTime: 0,
    })
    const handleExport = () => {
        const rows = data?.items.map((item: any) => {
            return {
                "Variant SKU": item.sku,
                "Variant Inventory Adjust": item.quantity,
            }
        })
        if (!rows?.length) {
            toast({
                variant: "destructive",
                title: 'Error',
                description: 'No data to export!',
            })
            return
        }
        const orderId = data?.items[0].orderId
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
        XLSX.utils.sheet_add_aoa(worksheet, [["Variant SKU", "Variant Inventory Adjust"]], { origin: "A1" });
        XLSX.writeFile(workbook, `invoice-${orderId}.xlsx`, { compression: true });
    }
    const toolbar = (
        <div className="flex items-center gap-4">
            <Input ref={inputRef} placeholder="Invoice order id here" />
            <Button type="button" loading={isLoading} size="sm" onClick={() => {
                const orderId = inputRef.current?.value?.trim()
                if(!orderId) {
                    toast({
                        variant: "destructive",
                        title: 'Error',
                        description: 'Please input order id!',
                    })
                    return
                }
                setVariables({
                    ...variables,
                    ts: Date.now(),
                    orderId
                })
            }}>Filter Orders</Button>
            <Button type="button" variant={'outline'} size="sm" onClick={() => {
                handleExport()
            }}>Export Excel</Button>
        </div>
    )
    return (
        <Page title="Invoice" className="max-w-full">
            <CustomCard>
                <Suspense>
                    <DataTable<OrderItem, unknown>
                        ref={tableRef}
                        queryKey="orders"
                        columns={columns}
                        pagination={false}
                        data={data?.items || []}
                        toolbar={toolbar}
                        selection={
                            {
                                enabled: true,
                            }
                        }
                        onSearchParamsChange={(params) => {
                            setVariables(params)
                        }}
                    />
                </Suspense>
            </CustomCard>
        </Page>
    )
}
export default function ArrivalRatePage() {
    return <Suspense fallback={<div>Loading...</div>}>
        <Invoice />
    </Suspense>
}