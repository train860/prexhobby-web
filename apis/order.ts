import request from "@/lib/request";

export async function addToCart(data: any) {
  return request({
    url: "/api/add-to-cart",
    method: "POST",
    data,
  });
}

export async function orders(params: any) {
  return request({
    url: "/api/orders",
    method: "GET",
    params,
  });
}

