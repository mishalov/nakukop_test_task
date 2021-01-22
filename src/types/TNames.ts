type TSingleNameItem = {
  /**
   * Название продукта
   */
  N: string;

  /**
   * Назначение свойства непонятно
   */
  T: string;
};

type TBodyOfGroupName = {
  G: string;
  C?: number;
  B: Record<string, TSingleNameItem>;
};

type TNames = Record<string, TBodyOfGroupName>;

export default TNames;
