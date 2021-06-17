import { AxiosInstance, AxiosResponse } from "axios";
import { fold } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import TRemoteServiceErrorHandler from "types/TRemoteServiceErrorHandler";
import Axios, { AxiosError } from "axios";
import { left, right } from "fp-ts/lib/Either";
import IServicesProvider from "types/IServicesProvider";
import TData from "types/TData";
import TNames from "types/TNames";
import { remoteBaseUrl } from "services.config";
import TCurrencyItem from "types/TCurrencyItem";

class Remote implements IServicesProvider {
  api: AxiosInstance;

  constructor() {
    this.api = Axios.create({
      baseURL: remoteBaseUrl,
    });
  }

  /**
   * We suppose that in case of error (`success` != true in the answer)
   * back-end part apply right error code. + we dont have redirects (300). So in case of code != 200
   * flow goes to the left side of fold.
   *
   * @param url Url of JSON
   * @param config AXIOS Config if needed
   */
  private async getRequest<RemoteDataType = any>(url: string) {
    const { api } = this;
    try {
      const response = await api.get<any, AxiosResponse<RemoteDataType>>(url);
      return right(response);
    } catch (e) {
      return left(e as AxiosError<RemoteDataType>);
    }
  }

  private createFetchFromRemote<PredictedType = any>(url: string) {
    return async (errorHandler: TRemoteServiceErrorHandler<PredictedType>) =>
      pipe(
        await this.getRequest<PredictedType>(url),
        fold(
          flow(errorHandler, () => null),
          (response) => response.data
        )
      );
  }

  public getData = this.createFetchFromRemote<TData>("/dataRoute");
  public getNames = this.createFetchFromRemote<TNames>("/namesRoute");
  public getCurrencies =
    this.createFetchFromRemote<TCurrencyItem[]>("/currenciesRoute");
}

export default Remote;
