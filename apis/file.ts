import request from "@/lib/request";

//delete
export async function remove(ids: string[]) {
  return request({
    url: `/api/file`,
    method: "DELETE",
    data: { ids },
  });
}
//update
export async function update(data: any) {
  return request({
    url: "/api/file",
    method: "PUT",
    data,
  });
}
export async function info(id:string) {
  return request({
    url: `/api/file/${id}`,
    method: "GET",
  });
}
export async function list(params: any) {
  return request({
    url: "/api/file",
    method: "GET",
    params,
  });
}

