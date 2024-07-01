import request from "@/lib/request";

export async function invoice(orderId: string) {
  return request({
    url: "/api/invoice-detail",
    params: {
        orderId,
        },
  });
}

export async function orders(params: any) {
  return request({
    url: "/api/orders",
    method: "GET",
    params,
  });
}

