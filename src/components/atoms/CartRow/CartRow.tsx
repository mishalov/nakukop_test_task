import React from "react";
import TCartEntry from "types/TCartEntry";
import TProduct from "types/TProduct";
import Button from "../Button";
import InputNumber from "../InputNumber";
import styles from "./CartRow.module.scss";

interface ICartRowProps {
  item: TCartEntry;
  product: TProduct;
  createHandleChangeCount: (
    item: TCartEntry
  ) => (e: React.FormEvent<HTMLInputElement>) => void;
  createHandleRemoveItem: (item: TCartEntry) => () => void;
}
const CartRow: React.FC<ICartRowProps> = ({
  item,
  product,
  createHandleChangeCount,
  createHandleRemoveItem,
}) => {
  const { id, name, price, count: totalProductCount } = product;
  const { count } = item;

  return (
    <tr className={styles.row} key={id}>
      <td>{name}</td>
      <td>
        <InputNumber
          min={1}
          max={totalProductCount}
          value={count}
          onChange={createHandleChangeCount(item)}
        />
      </td>
      <td>{price}</td>
      <td>
        <Button onClick={createHandleRemoveItem(item)}>удалить</Button>
      </td>
    </tr>
  );
};

export default CartRow;
