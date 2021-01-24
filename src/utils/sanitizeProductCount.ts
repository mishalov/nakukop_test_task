import TProduct from "types/TProduct";

const sanitizeProductCount = (product: TProduct, count: number) =>
  count > 0 ? (count < product.count ? count : product.count) : 0;

export default sanitizeProductCount;
