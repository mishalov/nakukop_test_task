import TProduct from "types/TProduct";

/**
 * Min products in cart is 1, max - Amount in stock
 * @param product
 * @param count
 */
const sanitizeProductCount = (product: TProduct, count: number) =>
  count > 0 ? (count < product.count ? count : product.count) : 0;

export default sanitizeProductCount;
