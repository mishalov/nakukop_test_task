import { filter } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import React from "react";
import ProductsTable from ".";
import { IProductsTableProps } from "./ProductsTable";

interface IProductTableHocProps extends IProductsTableProps {
  directComponent?: boolean;
}

const withFilterByGroup = (
  Component: React.ComponentType<IProductsTableProps>
) => (props: IProductTableHocProps) => {
  const { directComponent } = props;
  if (directComponent) return <ProductsTable {...props} />;
  const { group, products } = props;

  const filtredProducts = pipe(
    products,
    filter((product) => product.groupId === group.id)
  );

  return <Component {...props} products={filtredProducts} />;
};

export default withFilterByGroup;
