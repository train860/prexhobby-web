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
//order-arrival-rate
export async function arrivalRate(params: any) {
  return request({
    url: "/api/order-arrival-rate",
    method: "GET",
    params,
  });
}

