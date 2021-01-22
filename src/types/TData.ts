import TDataItem from "./TDataItem";

type TData = {
  Error: string;
  Id: 0;
  Success: boolean;
  Value: {
    Goods: TDataItem[];
  };
};

export default TData;
