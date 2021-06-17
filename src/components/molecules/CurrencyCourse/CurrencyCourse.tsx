import Preloader from "components/atoms/Preloader";
import React from "react";
import { TEvents, TState } from "store";
import { useStoreon } from "storeon/react";
import getCurrentCurrencyObject from "utils/getCurrentCurrencyObject";
import styles from "./CurrencyCourse.module.scss";
import cn from "classnames";

const CurrencyCourse = () => {
  const { currencies, currentCurrency, previousCurrencies } = useStoreon<
    TState,
    TEvents
  >("currencies", "currentCurrency", "previousCurrencies");

  if (!currencies || !currentCurrency || !previousCurrencies)
    return <Preloader size="10px" />;

  const current = getCurrentCurrencyObject(currencies, currentCurrency);

  const previous = getCurrentCurrencyObject(
    previousCurrencies,
    currentCurrency
  );

  if (!current || !previous) return <Preloader size="10px" />;

  const difference = current.multiplier - previous.multiplier;

  const isFalling = difference > 0;
  const isRising = difference < 0;

  const differenseSign = isRising ? "" : "+";

  return (
    <div
      className={cn(styles.currency, {
        [styles.isFalling]: isFalling,
        [styles.isRising]: isRising,
      })}
    >
      Currency course is ({currentCurrency}) : {current.multiplier}
      {current.sign} for $1 ({differenseSign}
      {difference})
    </div>
  );
};

export default CurrencyCourse;
