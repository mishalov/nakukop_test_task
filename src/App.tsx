import React, { useEffect } from "react";
import { useStoreon } from "storeon/react";
import ProductGroups from "components/organisms/ProductGroups";
import "reset-css";
import Container from "components/atoms/Container";
import styles from "./App.module.scss";
import "./styles/_global.scss";
import CartContainer from "components/organisms/CartContainer";
import Preloader from "components/atoms/Preloader";
import { TEvents, TState } from "store";
import CurrencyCourse from "components/molecules/CurrencyCourse";

const App = () => {
  const { dispatch, products, groups } = useStoreon<TState, TEvents>(
    "products",
    "groups"
  );

  useEffect(() => {
    dispatch("productsGroups/load");
    return () => dispatch("exit");
  }, [dispatch]);

  if (!products || !groups) return <Preloader size="100px" />;

  return (
    <Container className={styles.application}>
      <ProductGroups />
      <CartContainer className={styles.cart} />
      <CurrencyCourse />
    </Container>
  );
};

export default App;
