/**
 * В данном проекте стор было решено не декомпозировать, потому что данных мало - всего два типа
 */

import {
  filter,
  findFirst,
  findIndex,
  getMonoid,
  updateAt,
} from "fp-ts/lib/Array";
import { constNull, pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import { currenciesRefetchTime, servicesProvider } from "services.config";
import { createStoreon, StoreonModule } from "storeon";
import IServicesProvider from "types/IServicesProvider";
import TCartEntry from "types/TCartEntry";
import TCurrencyAlias from "types/TCurrencyAlias";
import TCurrencyItem from "types/TCurrencyItem";
import TGroup from "types/TGroup";
import TProduct from "types/TProduct";
import mergeDataAndNames from "utils/mergeDataAndNames";
import updateCartItemCount from "utils/updateCartItemCount";

export type TState = {
  servicesProvider: IServicesProvider;
  loading: boolean;
  error: string;
  groups: TGroup[];
  products: TProduct[];
  cart: TCartEntry[];
  currencies: TCurrencyItem[];
  previousCurrencies: TCurrencyItem[];
  currentCurrency: TCurrencyAlias;
  currenciesTimer: NodeJS.Timeout;
};

export type TEvents = {
  error: string;
  loading: boolean;
  exit: undefined;
  "productsGroups/load": never;
  "productsGroups/save": { products: TProduct[]; groups: TGroup[] };
  "productsGroups/updateProductName": { product: TProduct; newName: string };
  "cart/add": { product: TProduct };
  "cart/updateCount": { item: TCartEntry; count: number };
  "cart/remove": { item: TCartEntry };
  "currencies/fetch": undefined;
  "currencies/set": TCurrencyItem[];
};

const mainModule: StoreonModule<TState, TEvents> = (store) => {
  /**
   * Реализация внедрения зависимостей.
   * Мой первый опыт работы со `storeon`, надеюсь, тут не накосячил.
   */
  store.on("@init", () => ({
    servicesProvider,
    loading: true,
    cart: [],
    currentCurrency: "rub",
    currenciesTimer: setInterval(
      () => store.dispatch("currencies/fetch"),
      currenciesRefetchTime
    ),
  }));

  store.on("exit", (state) => {
    clearInterval(state.currenciesTimer);
  });

  /**
   * Получить Группы и Продукты в удобоваримом виде
   */
  store.on("productsGroups/load", async () => {
    store.dispatch("loading", true);
    const dataErrorHandler = () => {
      store.dispatch("error", "Не могу получить Data.json");
    };

    const namesErrorHandler = () => {
      store.dispatch("error", "Не могу получить Names.json");
    };

    const [data, names] = await Promise.all([
      servicesProvider.getData(dataErrorHandler),
      servicesProvider.getNames(namesErrorHandler),
    ]);

    if (!data) {
      dataErrorHandler();
      return;
    }

    if (!names) {
      namesErrorHandler();
      return;
    }

    store.dispatch("currencies/fetch");
    store.dispatch("productsGroups/save", mergeDataAndNames(data, names));
  });

  /**
   * Как я понял, асинхронный action не может возвращать значения, поэтому
   * я сделал action который вызывается при успешном получении продуктов и групп
   */
  store.on("productsGroups/save", (_, payload) => ({
    ...payload,
    loading: false,
  }));

  store.on("productsGroups/updateProductName", ({ products }, payload) =>
    pipe(
      products,
      updateAt(
        pipe(
          products,
          findIndex((product) => product.id === payload.product.id),
          fold(
            () => -1,
            (index) => index
          )
        ),
        { ...payload.product, name: payload.newName }
      ),
      fold(constNull, (newProducts) => ({ products: newProducts }))
    )
  );

  /**
   * Если продукт добавляемый в корзину уже там лежит - увеличиваем количество по этой позиции
   * на единицу, иначе просто добавляем
   */
  store.on("cart/add", ({ cart, products }, { product }) => ({
    cart: pipe(
      cart,
      findFirst((cart) => cart.productId === product.id),
      fold(
        () => {
          const monoid = getMonoid<TCartEntry>();
          return monoid.concat(cart, [{ productId: product.id, count: 1 }]);
        },
        (el) => updateCartItemCount(cart, el, el.count + 1)
      )
    ),
  }));

  /**
   * Изменить количество товара в корзине
   */
  store.on("cart/updateCount", ({ cart }, { item, count }) => ({
    cart: pipe(
      cart,
      findFirst((cart) => cart.productId === item.productId),
      fold(
        () => cart,
        (el) => updateCartItemCount(cart, el, count)
      )
    ),
  }));

  /**
   * Просто удаление из корзины
   */
  store.on("cart/remove", ({ cart }, { item }) => ({
    cart: pipe(
      cart,
      filter((inCartItem) => inCartItem.productId !== item.productId)
    ),
  }));

  /**
   * Запрос списка валют
   */

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

  store.on("error", (_, errorMessage: string) => ({
    error: errorMessage,
    loading: false,
  }));

  store.on("loading", (_, loading) => ({ loading }));
};

const store = createStoreon<TState, TEvents>([mainModule]);

export default store;
