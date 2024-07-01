"use client"
import DataTable, { TableRef } from "@/components/biz/data-table"
import { OrderItem, columns } from "./components/columns"
import { arrivalRate } from "@/apis/order"
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

export default function ArrivalRate() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const tableRef = useRef<TableRef>(null)
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  })
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
    queryKey: ["arrival-rate", variables],
    queryFn: () => arrivalRate(variables),
    staleTime: 0,
  })

  const toolbar = (
    <div className="flex items-center gap-4">
      <DatePickerWithRange value={date} onChange={(value) => {
        setDate(value)
      }} />
      <Button type="button" loading={isLoading} size="sm" onClick={() => {
        if (!date || (!date.from && !date.to)) {
          toast({
            variant: "destructive",
            title: 'Error',
            description: 'Please select a date range',
          })
          return
        }
        const to = date.to || date.from
        const from = date.from || date.to
        setVariables({
          ...variables,
          startDate: format(from!, 'yyyy-MM-dd'),
          endDate: format(to!, 'yyyy-MM-dd'),
          ts: new Date().getTime()
        })
      }}>Filter Orders</Button>
    </div>
  )
  return (
    <Page title="Orders" className="max-w-full">
      <CustomCard>
      <Suspense>
        <DataTable<OrderItem,unknown>
          ref={tableRef}
          queryKey="orders"
          columns={columns}
          pagination={false}
          data={data?.orders || []}
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