/**
 * В данном проекте стор было решено не декомпозировать, потому что данных мало - всего два типа
 */

import getDataService from "services/getDataService";
import { createStoreon, StoreonModule } from "storeon";
import { useStoreon } from "storeon/react"; // or storeon/preact
import TGroup from "types/TGroup";
import TProduct from "types/TProduct";

type TState = {
  groups: TGroup[];
  products: TProduct[];
};

type TEvents = {};

const mainModule: StoreonModule<TState, TEvents> = (store) => {
  store.on("@init", async () => {
    console.log("инициализируюсь");
    console.log(await getDataService(console.log));
  });
};

const store = createStoreon<TState, TEvents>([mainModule]);

export default store;
