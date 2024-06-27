import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
const NEXT_PUBLIC_FILE_DOMAIN = process.env.NEXT_PUBLIC_FILE_DOMAIN;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function parseSearchParams(searchParams: URLSearchParams) {
  const { page, size, sort } = Object.fromEntries(searchParams.entries())
  let pageNumber = page ? parseInt(page) : 1
  if (pageNumber < 1) {
    pageNumber = 1
  }

  let pageSize = size ? parseInt(size) : 10
  if (pageSize < 1) {
    pageSize = 10
  }
  const offset = (pageNumber - 1) * pageSize
  let orderBy = '';
  if (sort) {
    const sorts = sort.split(',');
    const orderByParts = sorts.map((sortItem) => {
      const [field, direction] = sortItem.split('_');
      return `${field}: ${direction.toLowerCase()}`;
    });
    orderBy = `orderBy: { ${orderByParts.join(', ')} }`;
  }

  return {
    pageNumber,
    pageSize,
    offset,
    orderBy
  }
}
export function fileUrl(src: string | undefined) {
  const domains = JSON.parse(NEXT_PUBLIC_FILE_DOMAIN);
  if (!src) {
    return null;
  }
  if (src.includes('http://') || src.includes('https://')) {
    return src;
  }
  const list = src.split(',');
  const domain = domains[list[0]];
  if (!domain) {
    return src;
  }
  return `${domain}/${list[1]}`;
}