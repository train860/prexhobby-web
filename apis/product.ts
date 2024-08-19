import request from "@/lib/request";

export async function products(params: any) {
  return request({
    url: "/api/products",
    method: "GET",
    params,
  });
}
