import { findFirst } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import TCurrencyAlias from "types/TCurrencyAlias";
import TCurrencyItem from "types/TCurrencyItem";

/**
 * Получение объекта валюты из списка валют по алиасу
 * @param currencies
 * @param currentCurrency
 */
const getCurrentCurrencyObject = (
  currencies: TCurrencyItem[],
  currentCurrency: TCurrencyAlias
) =>
  pipe(
    currencies,
    findFirst((el) => el.alias === currentCurrency),
    fold(
      () => null,
      (el) => el
    )
  );

export default getCurrentCurrencyObject;
