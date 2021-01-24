import { filter, findIndex } from "fp-ts/lib/Array";
import { constFalse, constTrue, pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import React from "react";
import ProductsTable from ".";
import { ICartProps } from "./Cart";

interface ICartHocProps extends ICartProps {
  directComponent?: boolean;
}

const withFilterByAddedToCart = (
  Component: React.ComponentType<ICartProps>
) => (props: ICartHocProps) => {
  const { directComponent } = props;
  if (directComponent) return <ProductsTable {...props} />;
  const { products, items } = props;

  const filtredProducts = pipe(
    products,
    filter((product) =>
      pipe(
        items,
        findIndex((cartItem) => cartItem.productId === product.id),
        fold(constFalse, constTrue)
      )
    )
  );

  return <Component {...props} products={filtredProducts} />;
};

export default withFilterByAddedToCart;
