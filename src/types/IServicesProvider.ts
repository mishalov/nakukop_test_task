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
}

export default IServicesProvider;
