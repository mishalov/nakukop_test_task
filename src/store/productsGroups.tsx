import { findIndex, updateAt } from "fp-ts/lib/Array";
import { constNull, pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import { servicesProvider } from "services.config";
import { TEvents, TState } from "store";
import { StoreonModule } from "storeon";
import mergeDataAndNames from "utils/mergeDataAndNames";

const productsGroupsModule: StoreonModule<TState, TEvents> = (store) => {
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
};

export default productsGroupsModule;
