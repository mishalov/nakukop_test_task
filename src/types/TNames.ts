type TSingleNameItem = {
  /**
   * Name of the product
   */
  N: string;
  T: string;
};

type TBodyOfGroupName = {
  G: string;
  C?: number;
  B: Record<string, TSingleNameItem>;
};

type TNames = Record<string, TBodyOfGroupName>;

export default TNames;
