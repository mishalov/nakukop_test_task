import TCurrencyAlias from "./TCurrencyAlias";

type TCurrencyItem = {
  alias: TCurrencyAlias;
  /**
   * Число, на которое умножается ДОЛЛАР для получения акутальной цены в данной валюте
   */
  multiplier: number;
  sign: string;
};

export default TCurrencyItem;
