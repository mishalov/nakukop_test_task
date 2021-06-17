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
   * If product that was added to cart is already there - just increment amount of it. Otherwise - add it
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
        (cartElement) =>
          updateCartItemCount(
            cart,
            cartElement,
            cartElement.count < product.count
              ? cartElement.count + 1
              : cartElement.count
          )
      )
    ),
  }));

  /**
   * Change count of product in cart
   */
  store.on("cart/updateCount", ({ cart, products }, { item, count }) => {
    const defaultBehaviour = () => cart;

    return {
      cart: pipe(
        cart,
        findFirst((cart) => cart.productId === item.productId),
        fold(defaultBehaviour, (cartElement) =>
          pipe(
            products,
            findFirst((product) => product.id === cartElement.productId),
            fold(defaultBehaviour, (product) =>
              updateCartItemCount(
                cart,
                cartElement,
                sanitizeProductCount(product, count)
              )
            )
          )
        )
      ),
    };
  });

  /**
   * Remove from the cart
   */
  store.on("cart/remove", ({ cart }, { item }) => ({
    cart: pipe(
      cart,
      filter((inCartItem) => inCartItem.productId !== item.productId)
    ),
  }));
};

export default cartModule;
