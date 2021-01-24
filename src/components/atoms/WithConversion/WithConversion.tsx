import React from "react";
import { useStoreon } from "storeon/react";
import { TState, TEvents } from "store";
import Preloader from "components/atoms/Preloader";
import getCurrentCurrencyObject from "utils/getCurrentCurrencyObject";

interface IWithConversionProps {
  children: number;
}

const WithConversion: React.FC<IWithConversionProps> = ({ children }) => {
  const { currencies, currentCurrency } = useStoreon<TState, TEvents>(
    "currencies",
    "currentCurrency"
  );

  if (!currencies) return <Preloader size="10px" />;

  const curentCurrencyObject = getCurrentCurrencyObject(
    currencies,
    currentCurrency
  );

  if (!curentCurrencyObject) return <Preloader size="10px" />;

  return (
    <>
      {new Intl.NumberFormat().format(
        children * curentCurrencyObject.multiplier
      )}
      {curentCurrencyObject.sign}
    </>
  );
};

export default WithConversion;
