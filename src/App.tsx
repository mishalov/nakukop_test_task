import React from "react";
import "./App.scss";
import { StoreContext } from "storeon/react";
import store from "store";
import ProductsTable from "components/organisms/ProductsTable";

const App = () => {
  return (
    <StoreContext.Provider value={store}>
      <div className="App">
        <ProductsTable />
      </div>
    </StoreContext.Provider>
  );
};

export default App;
