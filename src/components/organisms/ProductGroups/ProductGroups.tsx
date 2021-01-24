import ProductsTable from "components/molecules/ProductsTable";
import React, { useState } from "react";
import { useStoreon } from "storeon/react";
import styles from "./ProductGroups.module.scss";
import TGroup from "types/TGroup";
import TProduct from "types/TProduct";

const ProductGroups = () => {
  const { dispatch, groups, products } = useStoreon("groups", "products");
  const [activeTalbe, setActiveTable] = useState<number | null>(null);

  const handleOnProductChange = (product: TProduct, newName: string) =>
    dispatch("productsGroups/updateProductName", { product, newName });

  const renderGroupTable = (group: TGroup) => (
    <div className={styles.group_wrapper}>
      <ProductsTable
        className={styles.group}
        key={group.id}
        group={group}
        products={products}
        onProductClick={() => {}}
        onProductChange={handleOnProductChange}
        onActivateEdit={setActiveTable}
        editIsActive={activeTalbe === group.id}
      />
    </div>
  );

  return <div className={styles.groups}>{groups.map(renderGroupTable)}</div>;
};

export default ProductGroups;
