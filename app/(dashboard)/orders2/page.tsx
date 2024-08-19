"use client";
import DataTable, { TableRef } from "@/components/biz/data-table";
import { OrderItem, columns } from "./components/columns";
import { orders, addToCart } from "@/apis/order";
import Page from "@/components/biz/page";
import CustomCard from "@/components/biz/custom-card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { addDays, format, set } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Suspense, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from "xlsx";
export default function Orders2() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const tableRef = useRef<TableRef>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [variables, setVariables] = useState({});
  const { data, isLoading, refetch } = useQuery<any>({
    queryKey: ["orders", variables],
    queryFn: () => orders(variables),
    staleTime: 0,
  });
  const handleDownload = () => {
    const selection = tableRef.current?.rowSelection() || {};
    const keys: string[] = Object.keys(selection);
    const rows: any[] = [];
    data?.orders.forEach((item: any) => {
      const key = String(item.id);
      if (!keys.includes(key)) {
        return;
      }
      const lineItems = item["line_items"];
      const shippingAddress = item["shipping_address"];
      for (let i = 0; i < lineItems.length; i++) {
        const lineItem = lineItems[i];
        rows.push({
          "Ref(*)": item.name,
          "Sku(*)": lineItem.sku,
          "Quantity(*)": lineItem.quantity,
          Channel: "Shopify",
          "First Name(*)": shippingAddress["first_name"],
          "Last Name(*)": shippingAddress["last_name"],
          Company: "",
          "Postcode(*)": shippingAddress.postcode || shippingAddress.zip || "",
          "State(*)": shippingAddress.state || shippingAddress.province || "",
          "City(*)": shippingAddress.city,
          Telephone: shippingAddress.phone,
          "Address1(*)": shippingAddress.address1,
          Address2: shippingAddress.address1 || "",
        });
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
          "Ref(*)",
          "Sku(*)",
          "Quantity(*)",
          "Channel",
          "First Name(*)",
          "Last Name(*)",
          "Company",
          "Postcode(*)",
          "State(*)",
          "City(*)",
          "Telephone",
          "Address1(*)",
          "Address2",
        ],
      ],
      { origin: "A1" }
    );
    XLSX.writeFile(workbook, `orders.xlsx`, { compression: true });
  };
  const toolbar = (
    <div className="flex items-center gap-4">
      <DatePickerWithRange
        value={date}
        onChange={(value) => {
          setDate(value);
        }}
      />
      <Button
        type="button"
        loading={isLoading}
        size="sm"
        onClick={() => {
          if (!date || (!date.from && !date.to)) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Please select a date range",
            });
            return;
          }
          const to = date.to || date.from;
          const from = date.from || date.to;
          setVariables({
            ...variables,
            startDate: format(from!, "yyyy-MM-dd"),
            endDate: format(to!, "yyyy-MM-dd"),
            ts: new Date().getTime(),
          });
        }}
      >
        Filter Orders
      </Button>
      <Button
        type="button"
        variant={"destructive"}
        loading={submitting}
        key={"submit"}
        size="sm"
        onClick={() => {
          handleDownload();
        }}
      >
        Download excel
      </Button>
    </div>
  );
  return (
    <Page title="Orders" className="max-w-full">
      <CustomCard>
        <Suspense>
          <DataTable<OrderItem, unknown>
            ref={tableRef}
            queryKey="orders"
            columns={columns}
            pagination={false}
            data={data?.orders || []}
            toolbar={toolbar}
            selection={{
              enabled: true,
            }}
          />
        </Suspense>
      </CustomCard>
    </Page>
  );
}
