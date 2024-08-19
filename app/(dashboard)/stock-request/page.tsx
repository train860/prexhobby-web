"use client";
import DataTable, { TableRef } from "@/components/biz/data-table";
import columns, { OrderItem } from "./components/columns";
import { invoice, invoice2 } from "@/apis/invoice";
import Page from "@/components/biz/page";
import CustomCard from "@/components/biz/custom-card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { addDays, format, set } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { addProducts, list } from "@/apis/request";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/biz/custom-select";

function Invoice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [requestId, setRequestId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string>("invoice");
  const tableRef = useRef<TableRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultVariables = useMemo(() => {
    const vars: Record<string, any> = {};
    const keys = Array.from(searchParams.keys());
    keys.forEach((k) => {
      vars[k] = searchParams.get(k);
    });
    return {
      ...vars,
    };
  }, []);
  const [variables, setVariables] = useState(defaultVariables);
  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    refetch: invoiceRefetch,
  } = useQuery<any>({
    queryKey: ["invoice", variables],
    queryFn: () => invoice2(variables),
    enabled: !!variables.orderId || !!variables.barcode,
    staleTime: 0,
  });
  const { data: requestsData, isLoading: requestsLoading } = useQuery<any>({
    queryKey: ["requests"],
    queryFn: () => list(),
    staleTime: 0,
  });
  useEffect(() => {
    const list = requestsData?.requests || [];
    if (list.length === 0) {
      return;
    }
    const defaultValue = list[0].requestId;
    setRequestId(String(defaultValue));
  }, [requestsData]);
  const handleSubmit = () => {
    const selection = tableRef.current?.rowSelection() || {};
    //get selected rows
    const selectedRows = invoiceData?.items.filter((item: any) => {
      return selection[item.sku];
    });
    if (!selectedRows?.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No data to submit!",
      });
      return;
    }
    const data = {
      requestId,
      products: selectedRows.map((item: any) => {
        return {
          sku: item.sku,
          quantity: Number(item.qty) || 1,
        };
      }),
    };
    setSubmitting(true);
    addProducts(data)
      .then(() => {
        toast({
          title: "Success",
          description: "Products added successfully!",
        });
        //tableRef.current?.clearSelection();
        setSubmitting(false);
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "An error occurred while adding products. Please try again later.",
        });
        setSubmitting(false);
      });
  };
  const handleExport = () => {
    const selection = tableRef.current?.rowSelection() || {};
    const skus: string[] = Object.keys(selection);
    const rows: any[] = [];

    invoiceData?.items.forEach((item: any) => {
      const sku = item.sku;
      if (skus.includes(sku)) {
        rows.push({
          "Carton Index": "",
          SKU: item.sku,
          UPC: item.barcode,
          Name: item.productName,
          "Volum/unit （cm）": item.product.specification || "",
          "Weight (g)": item.product.weight || "",
          "Warehouse Inventory": item.qty,
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
          "Carton Index",
          "SKU",
          "UPC",
          "Name",
          "Volum/unit （cm）",
          "Weight (g)",
          "Warehouse Inventory",
        ],
      ],
      { origin: "A1" }
    );
    XLSX.writeFile(workbook, `stock-request.xlsx`, { compression: true });
  };
  const renderRequests = () => {
    if (requestsLoading || !requestsData) {
      return null;
    }
    const list = requestsData.requests || [];
    if (list.length === 0) {
      return null;
    }
    return (
      <div className="mt-2">
        <RadioGroup
          value={requestId}
          onValueChange={(v) => {
            setRequestId(String(v));
          }}
        >
          {list.map((request: any) => (
            <div
              key={String(request.requestId)}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem id={`r${request.requestId}`}  value={String(request.requestId)} />
              <Label htmlFor={`r${request.requestId}`}>{request.requestId}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  };
  const toolbar = (
    <div className="flex items-center gap-4">
      <Input ref={inputRef} placeholder="Invoice order id or barcode" />
      <CustomSelect
        id="type"
        className="w-40"
        options={[
          { label: "Invoice", value: "invoice" },
          { label: "Product", value: "product" },
        ]}
        value={type}
        onChange={(v) => {
          setType(v);
        }}
      ></CustomSelect>
      <Button
        type="button"
        loading={invoiceLoading}
        size="sm"
        onClick={() => {
          const v = inputRef.current?.value?.trim();
          if (!v) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Please input order id or barcode!",
            });
            return;
          }
          if (type === "invoice") {
            setVariables({
              ...variables,
              ts: Date.now(),
              orderId: v,
              barcode: "",
            });
          } else {
            setVariables({
              ...variables,
              ts: Date.now(),
              barcode: v,
              orderId: "",
            });
          }
        }}
      >
        Search
      </Button>
      <Button
        type="button"
        variant={"destructive"}
        size="sm"
        //disabled={!requestId}
        loading={submitting}
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit Stock Request
      </Button>
      <Button
        type="button"
        variant={"outline"}
        size="sm"
        onClick={() => {
          handleExport();
        }}
      >
        Export Excel
      </Button>
    </div>
  );
  return (
    <Page title="Stock in request" className="max-w-full">
      {renderRequests()}
      <CustomCard>
        <Suspense>
          <DataTable<OrderItem, unknown>
            ref={tableRef}
            queryKey="orders"
            columns={columns((key: string) => {})}
            pagination={false}
            data={invoiceData?.items || []}
            toolbar={toolbar}
            selection={{
              enabled: true,
            }}
            onSearchParamsChange={(params) => {
              setVariables(params);
            }}
            getRowId={(row) => row.sku}
          />
        </Suspense>
      </CustomCard>
    </Page>
  );
}
export default function ArrivalRatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Invoice />
    </Suspense>
  );
}
