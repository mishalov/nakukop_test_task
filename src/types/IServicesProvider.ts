import TData from "./TData";
import TNames from "./TNames";
import TRemoteServiceErrorHandler from "./TRemoteServiceErrorHandler";

interface IServicesProvider {
  getData: (errorHandler: TRemoteServiceErrorHandler<TData>) => Promise<TData>;
  getNames: (
    errorHandler: TRemoteServiceErrorHandler<TNames>
  ) => Promise<TNames>;
}

export default IServicesProvider;
