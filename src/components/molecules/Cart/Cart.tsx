import React, { useCallback } from "react";
import TCartEntry from "types/TCartEntry";
import styles from "./Cart.module.scss";
import cn from "classnames";
import TProduct from "types/TProduct";
import { constNull, pipe } from "fp-ts/lib/function";
import { findFirst } from "fp-ts/lib/Array";
import { fold } from "fp-ts/lib/Option";
import CartRow from "components/atoms/CartRow";

export interface ICartProps {
  items: TCartEntry[];
  products: TProduct[];
  className?: string;
  onRemoveEntry: (entry: TCartEntry) => void;
  onChangeCount: (entry: TCartEntry, count: number) => void;
}
const Cart: React.FC<ICartProps> = (props) => {
  const { items, className, onChangeCount, onRemoveEntry, products } = props;

  const createHandleChangeCount = useCallback(
    (item: TCartEntry) => (e: React.FormEvent<HTMLInputElement>) => {
      const value = Number(e.currentTarget.value);
      const min = Number(e.currentTarget.min);
      const max = Number(e.currentTarget.max);

      const trueValue = value > max ? max : value < min ? min : value;
      return onChangeCount(item, trueValue);
    },
    [onChangeCount]
  );

  const createHandleRemoveItem = useCallback(
    (item: TCartEntry) => () => onRemoveEntry(item),
    [onRemoveEntry]
  );

  const renderItemRow = useCallback(
    (item: TCartEntry) => {
      const product = pipe(
        products,
        findFirst((productItem) => productItem.id === item.productId),
        fold(constNull, (product) => product)
      );

      if (!product) return null;

      return (
        <CartRow
          product={product}
          item={item}
          createHandleRemoveItem={createHandleRemoveItem}
          createHandleChangeCount={createHandleChangeCount}
        />
      );
    },
    [createHandleChangeCount, createHandleRemoveItem, products]
  );

  return (
    <table className={cn(styles.cart, className)}>
      <thead className={styles.header}>
        <tr>
          <th className={cn(styles.header_item, styles.header_name)}>
            Наименование товара
          </th>

          <th className={cn(styles.header_item, styles.header_count)}>
            Количество
          </th>

          <th
            className={cn(styles.header_item, styles.header_price)}
            colSpan={2}
          >
            Цена
          </th>
        </tr>
      </thead>
      <tbody className={styles.body}>{items.map(renderItemRow)}</tbody>
    </table>
  );
};

export default Cart;