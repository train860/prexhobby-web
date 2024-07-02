import request from "@/lib/request";

export async function invoice(params: any) {
  return request({
    url: "/api/invoice-detail",
    params
  });
}

