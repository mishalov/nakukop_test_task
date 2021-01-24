import React, { useEffect } from "react";
import { useStoreon } from "storeon/react";
import ProductGroups from "components/organisms/ProductGroups";
import "reset-css";
import Container from "components/atoms/Container";
import styles from "./App.module.scss";
import "./styles/_global.scss";
import CartContainer from "components/organisms/CartContainer";

const App = () => {
  const { dispatch, products, groups } = useStoreon("products", "groups");

  useEffect(() => {
    dispatch("productsGroups/load");
  }, [dispatch]);

  if (!products || !groups) return <div>Загрузка...</div>;

  return (
    <Container className={styles.application}>
      <ProductGroups />
      <CartContainer className={styles.cart} />
    </Container>
  );
};

export default App;
