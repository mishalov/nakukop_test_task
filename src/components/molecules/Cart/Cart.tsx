import React, { useCallback } from "react";
import TCartEntry from "types/TCartEntry";
import styles from "./Cart.module.scss";
import cn from "classnames";
import TProduct from "types/TProduct";
import { constNull, pipe } from "fp-ts/lib/function";
import { findFirst } from "fp-ts/lib/Array";
import { fold } from "fp-ts/lib/Option";
import CartRow from "components/atoms/CartRow";
import getSummForCart from "utils/getSummForCart";
import WithConversion from "components/atoms/WithConversion";

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
      return onChangeCount(item, value);
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
          key={item.productId}
          product={product}
          item={item}
          createHandleRemoveItem={createHandleRemoveItem}
          createHandleChangeCount={createHandleChangeCount}
        />
      );
    },
    [createHandleChangeCount, createHandleRemoveItem, products]
  );

  const summ = getSummForCart(products, items);

  return (
    <table className={cn(styles.cart, className)}>
      <thead className={styles.header}>
        <tr>
          <th className={cn(styles.header_item, styles.header_name)}>
            Name of product
          </th>

          <th className={cn(styles.header_item, styles.header_count)}>
            Amount
          </th>

          <th
            className={cn(styles.header_item, styles.header_price)}
            colSpan={2}
          >
            Price
          </th>
        </tr>
      </thead>
      <tbody className={styles.body}>
        {items.map(renderItemRow)}
        <tr>
          <td colSpan={3} className={styles.summ}>
            Summary:
            <WithConversion>{summ}</WithConversion>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Cart;
