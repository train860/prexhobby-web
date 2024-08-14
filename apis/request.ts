import request from "@/lib/request";

export async function list() {
  return request({
    url: "/api/requests",
    method: "GET",
  });
}
export async function addProducts(data: any) {
  return request({
    url: "/api/request",
    method: "POST",
    data,
  });
}
