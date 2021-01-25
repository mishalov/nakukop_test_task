import { findIndex, updateAt } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import TCartEntry from "types/TCartEntry";

/**
 * Получает текущую корзину, товар который нужно обновить и новое количество. Возвращает корзину с обновленным товаром
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
