import { AxiosInstance, AxiosResponse } from "axios";
import { fold } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import TRemoteServiceErrorHandler from "types/TRemoteServiceErrorHandler";
import Axios, { AxiosError } from "axios";
import TGetRequestType from "types/TGetRequestType";
import { left, right } from "fp-ts/lib/Either";
import IServicesProvider from "types/IServicesProvider";
import TData from "types/TData";
import TNames from "types/TNames";
import { remoteBaseUrl } from "services.config";

class Remote implements IServicesProvider {
  api: AxiosInstance = Axios.create({
    baseURL: remoteBaseUrl,
  });

  /**
   * Мы предполагаем что при ошибке (в ответе `Success` != true)
   * бэк еще и статус ставит согласно ошибке. Тогда при коде != 200
   * флоу уходит в левую часть принимающего фолда и там обрабатывается
   * прокинутым пользователем обработчиком
   *
   * @param url Урл по которому находится джсон
   * @param config Конфиг для аксиоса если нужен будет
   */
  private getRequest: TGetRequestType<any> = async (url) => {
    const { api } = this;
    try {
      const response = await api.get<any, AxiosResponse<any>>(url);
      return right(response);
    } catch (e) {
      return left(e as AxiosError<any>);
    }
  };

  public getData = async (errorHandler: TRemoteServiceErrorHandler<TData>) =>
    pipe(
      await this.getRequest("/dataRoute"),
      fold(
        flow(errorHandler, () => null),
        (response) => response.data
      )
    );

  public getNames = async (errorHandler: TRemoteServiceErrorHandler<TNames>) =>
    pipe(
      await this.getRequest("/namesRoute"),
      fold(
        flow(errorHandler, () => null),
        (response) => response.data
      )
    );
}

export default Remote;
