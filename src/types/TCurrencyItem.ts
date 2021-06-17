import TCurrencyAlias from "./TCurrencyAlias";

type TCurrencyItem = {
  alias: TCurrencyAlias;
  /**
   * Dollar will by multiplied by this to get price in chosen currency
   */
  multiplier: number;
  sign: string;
};

export default TCurrencyItem;
