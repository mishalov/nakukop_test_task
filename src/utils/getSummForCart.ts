import { findFirst, map, reduce } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import TCartEntry from "types/TCartEntry";
import TProduct from "types/TProduct";

/**
 * Get summary for products in cart
 * @param products
 * @param cartItems
 */
const getSummForCart = (products: TProduct[], cartItems: TCartEntry[]) => {
  const mapCartItemsToSumms = (cartItem: TCartEntry) =>
    pipe(
      products,
      findFirst((product) => product.id === cartItem.productId),
      fold(
        () => 0,
        (product) => product.price * cartItem.count
      )
    );

  return pipe(
    cartItems,
    map(mapCartItemsToSumms),
    reduce(0, (prev, current) => prev + current)
  );
};

export default getSummForCart;
