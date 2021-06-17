import { currenciesRefetchTime, servicesProvider } from "services.config";
import { createStoreon, StoreonModule } from "storeon";
import IServicesProvider from "types/IServicesProvider";
import TCartEntry from "types/TCartEntry";
import TCurrencyAlias from "types/TCurrencyAlias";
import TCurrencyItem from "types/TCurrencyItem";
import TGroup from "types/TGroup";
import TProduct from "types/TProduct";
import cartModule from "./cart";
import currenciesModule from "./currencies";
import productsGroupsModule from "./productsGroups";

export type TState = {
  servicesProvider: IServicesProvider;
  loading: boolean;
  cart: TCartEntry[];
  error: string;
  groups: TGroup[];
  products: TProduct[];
  currencies: TCurrencyItem[];
  previousCurrencies: TCurrencyItem[];
  currentCurrency: TCurrencyAlias;
  currenciesTimer: NodeJS.Timeout;
};

export type TEvents = {
  error: string;
  loading: boolean;
  exit: undefined;
  "currencies/fetch": undefined;
  "currencies/set": TCurrencyItem[];
  "cart/add": { product: TProduct };
  "cart/updateCount": { item: TCartEntry; count: number };
  "cart/remove": { item: TCartEntry };
  "productsGroups/load": never;
  "productsGroups/save": { products: TProduct[]; groups: TGroup[] };
  "productsGroups/updateProductName": { product: TProduct; newName: string };
};

const mainModule: StoreonModule<TState, TEvents> = (store) => {
  store.on("@init", () => ({
    cart: [],
    currentCurrency: "rub",
    currenciesTimer: setInterval(
      () => store.dispatch("currencies/fetch"),
      currenciesRefetchTime
    ),
    servicesProvider,
    loading: true,
  }));

  store.on("error", (_, errorMessage: string) => ({
    error: errorMessage,
    loading: false,
  }));

  store.on("loading", (_, loading) => ({ loading }));
};

const store = createStoreon<TState, TEvents>([
  mainModule,
  productsGroupsModule,
  cartModule,
  currenciesModule,
]);

export default store;
