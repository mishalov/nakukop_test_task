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

/**
 * В этом классе есть два метода.
 * Можно генерик-параметрами сделать так, чтобы был один (url передавать параметром)
 *
 * Но можно и оставить, как в данной реализации и сделано. В случае, если при запросе разных данных с ремоута
 * будет требоваться, например, разный конфиг аксиоса - такая реализация будет оправдана.
 */
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

  /**
   * DRY : Читай коммент к классу
   * @param errorHandler Обработчик ошибок при фетче Data
   */

  public getData = async (errorHandler: TRemoteServiceErrorHandler<TData>) =>
    pipe(
      await this.getRequest<TData>("/dataRoute"),
      fold(
        flow(errorHandler, () => null),
        (response) => response.data
      )
    );

  /**
   * DRY : Читай коммент к классу
   * @param errorHandler Обработчик ошибок при фетче Data
   */
  public getNames = async (errorHandler: TRemoteServiceErrorHandler<TNames>) =>
    pipe(
      await this.getRequest<TNames>("/namesRoute"),
      fold(
        flow(errorHandler, () => null),
        (response) => response.data
      )
    );
}

export default Remote;
