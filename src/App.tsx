import React, { useEffect } from "react";
import "./App.scss";
import { StoreContext, useStoreon } from "storeon/react";
import ProductsTable from "components/organisms/ProductsTable";

const App = () => {
  const { dispatch, products, groups } = useStoreon("products", "groups");
  console.log("products, groups: ", products, groups);
  useEffect(() => {
    dispatch("productsGroups/load");
  }, [dispatch]);

  return (
    <div className="App">
      <ProductsTable />
    </div>
  );
};

export default App;
