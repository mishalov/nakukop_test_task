import { findIndex, updateAt } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import TCartEntry from "types/TCartEntry";

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
        findIndex((el) => el.productId === item.productId),
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
