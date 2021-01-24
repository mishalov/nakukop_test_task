import { findFirst, map, reduce } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import TCartEntry from "types/TCartEntry";
import TProduct from "types/TProduct";

const getSummForCart = (products: TProduct[], cartItems: TCartEntry[]) =>
  pipe(
    cartItems,
    map((cartItem) =>
      pipe(
        products,
        findFirst((product) => product.id === cartItem.productId),
        fold(
          () => 0,
          (el) => el.price * cartItem.count
        )
      )
    ),
    reduce(0, (prev, current) => prev + current)
  );

export default getSummForCart;
