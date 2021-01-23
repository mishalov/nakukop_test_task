/**
 * В данном проекте стор было решено не декомпозировать, потому что данных мало - всего два типа
 */

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
  "productsGroups/load": never;
  "productsGroups/save": { products: TProduct[]; groups: TGroup[] };
};

const mainModule: StoreonModule<TState, TEvents> = (store) => {
  /**
   * Реализация внедрения зависимостей.
   * Мой первый опыт работы со `storeon`, надеюсь, тут не накосячил.
   */
  store.on("@init", () => ({
    servicesProvider,
  }));

  /**
   * Получить Группы и Продукты в удобоваримом виде
   */
  store.on("productsGroups/load", async (state) => {
    const dataErrorHandler = () => {
      store.dispatch("error", "Не могу получить Data.json");
    };

    const namesErrorHandler = () => {
      store.dispatch("error", "Не могу получить Names.json");
    };

    const data = await servicesProvider.getData(dataErrorHandler);

    if (!data) {
      dataErrorHandler();
      return;
    }

    const names = await servicesProvider.getNames(namesErrorHandler);

    if (!names) {
      namesErrorHandler();
      return;
    }

    store.dispatch("productsGroups/save", mergeDataAndNames(data, names));
  });

  store.on("productsGroups/save", (state, payload) => ({
    ...state,
    ...payload,
  }));

  store.on("error", (_, errorMessage: string) => ({
    error: errorMessage,
    loading: false,
  }));
};

const store = createStoreon<TState, TEvents>([mainModule]);

export default store;
