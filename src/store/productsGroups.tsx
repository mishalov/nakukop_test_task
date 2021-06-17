import { findIndex, updateAt } from "fp-ts/lib/Array";
import { constNull, pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import { servicesProvider } from "services.config";
import { TEvents, TState } from "store";
import { StoreonModule } from "storeon";
import mergeDataAndNames from "utils/mergeDataAndNames";

const productsGroupsModule: StoreonModule<TState, TEvents> = (store) => {
  /**
   * Get Groups and Products normalized
   */
  store.on("productsGroups/load", async () => {
    store.dispatch("loading", true);
    const dataErrorHandler = () => {
      store.dispatch("error", "Cant get Data.json");
    };

    const namesErrorHandler = () => {
      store.dispatch("error", "Cant get Names.json");
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
   * Async action cant return anything, soooooo
   * o created action that will be called after success fetch of products and groups
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
};

export default productsGroupsModule;
