import React from "react";
import { useStoreon } from "storeon/react";

const ProductsTable = () => {
  const { products, groups } = useStoreon("products", "groups");

  return <div> Products Table</div>;
};

export default ProductsTable;
