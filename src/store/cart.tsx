import { filter, findFirst, getMonoid } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import { TEvents, TState } from "store";
import { StoreonModule } from "storeon";
import TCartEntry from "types/TCartEntry";
import sanitizeProductCount from "utils/sanitizeProductCount";
import updateCartItemCount from "utils/updateCartItemCount";

const cartModule: StoreonModule<TState, TEvents> = (store) => {
  /**
   * Если продукт добавляемый в корзину уже там лежит - увеличиваем количество по этой позиции
   * на единицу, иначе просто добавляем
   */
  store.on("cart/add", ({ cart }, { product }) => ({
    cart: pipe(
      cart,
      findFirst((cart) => cart.productId === product.id),
      fold(
        () => {
          const monoid = getMonoid<TCartEntry>();
          return monoid.concat(cart, [{ productId: product.id, count: 1 }]);
        },
        (el) =>
          updateCartItemCount(
            cart,
            el,
            el.count < product.count ? el.count + 1 : el.count
          )
      )
    ),
  }));

  /**
   * Изменить количество товара в корзине
   */
  store.on("cart/updateCount", ({ cart, products }, { item, count }) => ({
    cart: pipe(
      cart,
      findFirst((cart) => cart.productId === item.productId),
      fold(
        () => cart,
        (el) =>
          pipe(
            products,
            findFirst((product) => product.id === el.productId),
            fold(
              () => cart,
              (product) =>
                updateCartItemCount(
                  cart,
                  el,
                  sanitizeProductCount(product, count)
                )
            )
          )
      )
    ),
  }));

  /**
   * Просто удаление из корзины
   */
  store.on("cart/remove", ({ cart }, { item }) => ({
    cart: pipe(
      cart,
      filter((inCartItem) => inCartItem.productId !== item.productId)
    ),
  }));
};

export default cartModule;
