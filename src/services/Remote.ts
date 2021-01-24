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
   * Мы предполагаем что при ошибке (в ответе `Success` != true)
   * бэк еще и статус ставит согласно ошибке. Тогда при коде != 200
   * флоу уходит в левую часть принимающего фолда и там обрабатывается
   * прокинутым пользователем обработчиком
   *
   * @param url Урл по которому находится джсон
   * @param config Конфиг для аксиоса если нужен будет
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
  public getCurrencies = this.createFetchFromRemote<TCurrencyItem[]>(
    "/currenciesRoute"
  );
}

export default Remote;
