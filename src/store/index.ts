/**
 * В данном проекте стор было решено не декомпозировать, потому что данных мало - всего два типа
 */

import { filter, findFirst, findIndex, updateAt } from "fp-ts/lib/Array";
import { constNull, constUndefined, pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import { servicesProvider } from "services.config";
import { createStoreon, StoreonModule } from "storeon";
import IServicesProvider from "types/IServicesProvider";
import TGroup from "types/TGroup";
import TProduct from "types/TProduct";
import mergeDataAndNames from "utils/mergeDataAndNames";

type TState = {
  servicesProvider: IServicesProvider;
  loading: boolean;
  error: string;
  groups: TGroup[];
  products: TProduct[];
};

type TEvents = {
  error: string;
  loading: boolean;
  "productsGroups/load": never;
  "productsGroups/save": { products: TProduct[]; groups: TGroup[] };
  "productsGroups/updateProductName": { product: TProduct; newName: string };
};

const mainModule: StoreonModule<TState, TEvents> = (store) => {
  /**
   * Реализация внедрения зависимостей.
   * Мой первый опыт работы со `storeon`, надеюсь, тут не накосячил.
   */
  store.on("@init", () => ({
    servicesProvider,
    loading: true,
  }));

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

  store.on("error", (_, errorMessage: string) => ({
    error: errorMessage,
    loading: false,
  }));

  store.on("loading", (_, loading) => ({ loading }));
};

const store = createStoreon<TState, TEvents>([mainModule]);

export default store;
