import { AxiosInstance } from "axios";
import { fold } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import TRemoteServiceErrorHandler from "types/TRemoteServiceErrorHandler";
import getRequest from "./api";

class Remote implements IDataProvider {
  axios: AxiosInstance;

  public getData = async (errorHandler: TRemoteServiceErrorHandler<TData>) =>
    pipe(
      await getRequest("/data"),
      fold(
        flow(errorHandler, () => null),
        (response) => response.data
      )
    );
}
