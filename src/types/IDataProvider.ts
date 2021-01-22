import TData from "./TData";
import TRemoteServiceErrorHandler from "./TRemoteServiceErrorHandler";

interface IDataProvider {
  getData: (errorHandler: TRemoteServiceErrorHandler<TData>) => Promise<TData>;
}

export default IDataProvider;
