import TCurrencyItem from "./TCurrencyItem";
import TData from "./TData";
import TNames from "./TNames";
import TRemoteServiceErrorHandler from "./TRemoteServiceErrorHandler";

interface IServicesProvider {
  getData: (
    errorHandler: TRemoteServiceErrorHandler<TData>
  ) => Promise<TData | null>;

  getNames: (
    errorHandler: TRemoteServiceErrorHandler<TNames>
  ) => Promise<TNames | null>;

  getCurrencies: (
    errorHandler: TRemoteServiceErrorHandler<TCurrencyItem[]>
  ) => Promise<TCurrencyItem[] | null>;
}

export default IServicesProvider;
