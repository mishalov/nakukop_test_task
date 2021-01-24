import { TEvents, TState } from "store";
import { StoreonModule } from "storeon";
import TCurrencyItem from "types/TCurrencyItem";

const currenciesModule: StoreonModule<TState, TEvents> = (store) => {
  store.on("exit", (state) => {
    clearInterval(state.currenciesTimer);
  });

  store.on("currencies/fetch", async (state) => {
    const currencies = await state.servicesProvider.getCurrencies(
      console.error
    );

    if (!currencies) {
      store.dispatch("error", "Не удалось получить валюты!");
      return;
    }

    store.dispatch("currencies/set", currencies);
  });

  /**
   * сохранение валют в стор
   */
  store.on("currencies/set", (state, currencies: TCurrencyItem[]) => ({
    currencies,
    previousCurrencies: state.currencies || currencies,
  }));
};

export default currenciesModule;
