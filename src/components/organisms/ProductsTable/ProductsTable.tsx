import React from "react";
import { useStoreon } from "storeon/react";

const ProductsTable = () => {
  const { servicesProvider } = useStoreon("servicesProvider");

  return <div> Products Table</div>;
};

export default ProductsTable;
