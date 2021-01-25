import { filter, findFirst, map } from "fp-ts/lib/Array";
import { constNull, pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Option";
import { groupBy } from "fp-ts/lib/ReadonlyNonEmptyArray";
import { keys } from "fp-ts/lib/Record";
import TData from "types/TData";
import TGroup from "types/TGroup";
import {
  TProductNameDictionary,
  TProductNameDictionaryItem,
} from "types/TProductNameDictionary";
import TNames from "types/TNames";
import TProduct from "types/TProduct";
import getProductNamesDictionary from "./getProductNamesDictionary";

type TMergeDataAndNamesResult = {
  groups: TGroup[];
  products: TProduct[];
};

/**
 * Создание объектов групп из Data.json
 * @param data
 * @param names
 */
const createGroups = (data: TData, names: TNames): TGroup[] =>
  pipe(
    data.Value.Goods,
    groupBy((good) => good.G.toString()),
    keys,
    map((key) => ({ id: Number(key), name: names[key]?.G }))
  );

/**
 * @param data
 * @param names
 */
const createProducts = (
  data: TData,
  names: TProductNameDictionary
): TProduct[] =>
  pipe(
    data.Value.Goods,
    map((dataItem) =>
      pipe(
        pipe(
          names,
          findFirst<TProductNameDictionaryItem>(
            (item) => item.id === dataItem.T
          )
        ),
        fold(
          constNull,
          (el): TProduct => ({
            ...el,
            price: dataItem.C,
            count: dataItem.P,
            groupId: dataItem.G,
          })
        )
      )
    ),
    filter((el) => !!el)
  ) as TProduct[];

const mergeDataAndNames = (
  data: TData,
  names: TNames
): TMergeDataAndNamesResult => {
  const groups = createGroups(data, names);
  const products = createProducts(data, getProductNamesDictionary(names));
  return { groups, products };
};

export default mergeDataAndNames;
