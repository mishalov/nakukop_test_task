import Cart from "components/molecules/Cart";
import React, { useCallback } from "react";
import { useStoreon } from "storeon/react";
import TCartEntry from "types/TCartEntry";

interface ICartContaierProps {
  className?: string;
}

const CartContainer: React.FC<ICartContaierProps> = ({ className }) => {
  const { dispatch, cart, products } = useStoreon("cart", "products");

  const handleChangeCount = useCallback(
    (item: TCartEntry, count: number) =>
      dispatch("cart/updateCount", { item, count }),
    [dispatch]
  );

  const handleRemoveFromCart = useCallback(
    (item: TCartEntry) => dispatch("cart/remove", { item }),
    [dispatch]
  );

  return (
    <Cart
      items={cart}
      products={products}
      onChangeCount={handleChangeCount}
      onRemoveEntry={handleRemoveFromCart}
      className={className}
    />
  );
};

export default CartContainer;
