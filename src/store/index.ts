/**
 * В данном проекте стор было решено не декомпозировать, потому что данных мало - всего два типа
 */

import { servicesProvider } from "services.config";
import { createStoreon, StoreonModule } from "storeon";
import IServicesProvider from "types/IServicesProvider";
import TGroup from "types/TGroup";
import TProduct from "types/TProduct";

type TState = {
  servicesProvider: IServicesProvider;
  groups: TGroup[];
  products: TProduct[];
};

type TEvents = {};

const mainModule: StoreonModule<TState, TEvents> = (store) => {
  /**
   * Реализация внедрения зависимостей.
   * Мой первый опыт работы со `storeon`, надеюсь, тут не накосячил.
   */
  store.on("@init", () => ({
    servicesProvider,
  }));
};

const store = createStoreon<TState, TEvents>([mainModule]);

export default store;
