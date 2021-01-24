import EditableText from "components/atoms/EditableText";
import React, { useCallback } from "react";
import { useStoreon } from "storeon/react";
import TGroup from "types/TGroup";
import TProduct from "types/TProduct";
import styles from "./ProductsTable.module.scss";
import cn from "classnames";
import EditIcon from "components/atoms/Icons/EditIcon";

export interface IProductsTableProps {
  className?: string;
  group: TGroup;
  products: TProduct[];
  editIsActive?: boolean;
  onProductClick: (product: TProduct) => void;
  onProductChange: (product: TProduct, newName: string) => void;
  onActivateEdit: (id: number | null) => void;
}

const label = "Для редактирования таблицы кликните на иконку в шапке таблицы";

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
  }, [group, editIsActive]);

  const createHandleEditProductName = (product: TProduct) => (
    e: React.FormEvent<HTMLTextAreaElement>
  ) => onProductChange(product, e.currentTarget.value);

  const renderProduct = (product: TProduct) => (
    <tr key={product.id}>
      <td className={styles.row_item}>
        <EditableText
          className={styles.value}
          readOnly={!editIsActive}
          onInput={createHandleEditProductName(product)}
          title={label}
          rows={3}
        >
          {product.name}
        </EditableText>
      </td>
      <td className={cn(styles.price, styles.row_item)}>{product.price}</td>
    </tr>
  );

  return (
    <table className={cn(styles.table, className)}>
      <thead className={styles.header}>
        <tr>
          <th colSpan={2}>
            <div className={styles.title} title={label}>
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
