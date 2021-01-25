import TProduct from "types/TProduct";

/**
 * Минимум продукта в корзине - 1. Максимум - кол-во на складе
 * @param product
 * @param count
 */
const sanitizeProductCount = (product: TProduct, count: number) =>
  count > 0 ? (count < product.count ? count : product.count) : 0;

export default sanitizeProductCount;
