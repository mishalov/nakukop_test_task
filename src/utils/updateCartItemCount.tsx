import { findIndex, updateAt } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import TCartEntry from "types/TCartEntry";

/**
 * Get current cart, product that should be updated and new amount. Returns cart with updated product
 * @param cart
 * @param item
 * @param count
 */
const updateCartItemCount = (
  cart: TCartEntry[],
  item: TCartEntry,
  count: number
): TCartEntry[] =>
  pipe(
    cart,
    updateAt(
      pipe(
        cart,
        findIndex((cartElement) => cartElement.productId === item.productId),
        fold(
          () => -1,
          (index) => index
        )
      ),
      { ...item, count }
    ),
    fold(
      () => cart,
      (newCart) => newCart
    )
  );

export default updateCartItemCount;
