import EditableText from "components/atoms/EditableText";
import React, { useCallback } from "react";
import TGroup from "types/TGroup";
import TProduct from "types/TProduct";
import styles from "./ProductsTable.module.scss";
import cn from "classnames";
import EditIcon from "components/atoms/Icons/EditIcon";
import WithConversion from "components/atoms/WithConversion";

export interface IProductsTableProps {
  className?: string;
  group: TGroup;
  products: TProduct[];
  editIsActive?: boolean;
  onProductClick: (product: TProduct) => void;
  onProductChange: (product: TProduct, newName: string) => void;
  onActivateEdit: (id: number | null) => void;
}

const LABEL_EDIT = "To edit the table please click icon in the header of table";
const LABEL_TO_CART = "Click product to add it into cart";
const LABEL_IN_STOCk = "Amount in stock";

const ProductsTable: React.FC<IProductsTableProps> = (props) => {
  const {
    group,
    products,
    onProductClick,
    onProductChange,
    className,
    onActivateEdit,
    editIsActive,
  } = props;

  const handleActivateEdit = useCallback(() => {
    onActivateEdit(editIsActive ? null : group.id);
  }, [group, editIsActive, onActivateEdit]);

  const createHandleEditProductName = useCallback(
    (product: TProduct) => (e: React.FormEvent<HTMLTextAreaElement>) =>
      onProductChange(product, e.currentTarget.value),
    [onProductChange]
  );

  const createHandleProductClick = useCallback(
    (product: TProduct) => () => {
      if (!editIsActive) return onProductClick(product);
    },
    [onProductClick, editIsActive]
  );

  const renderName = useCallback(
    (product: TProduct) =>
      editIsActive ? (
        <EditableText
          className={styles.value}
          readOnly={!editIsActive}
          onInput={createHandleEditProductName(product)}
          rows={3}
          value={product.name}
        />
      ) : (
        <div className={styles.value}>{product.name}</div>
      ),
    [editIsActive, createHandleEditProductName]
  );

  const renderProduct = useCallback(
    (product: TProduct) => (
      <tr
        key={product.id}
        onClick={createHandleProductClick(product)}
        role="button"
        aria-label="Add into cart"
        title={LABEL_TO_CART}
      >
        <td className={styles.row_item}>{renderName(product)}</td>
        <td
          className={cn(styles.count, styles.row_item)}
          title={LABEL_IN_STOCk}
        >
          {product.count}
        </td>
        <td className={cn(styles.price, styles.row_item)}>
          <WithConversion>{product.price}</WithConversion>
        </td>
      </tr>
    ),
    [createHandleProductClick, renderName]
  );

  return (
    <table className={cn(styles.table, className)}>
      <thead className={styles.header}>
        <tr>
          <th colSpan={3}>
            <div className={styles.title} title={LABEL_EDIT}>
              {group.name}
              <EditIcon
                onClick={handleActivateEdit}
                fill={editIsActive ? "#00Bfff" : "#000"}
                size={20}
                className={styles.edit}
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>{products.map(renderProduct)}</tbody>
    </table>
  );
};

export default ProductsTable;
