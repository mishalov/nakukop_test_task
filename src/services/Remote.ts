import { AxiosInstance, AxiosResponse } from "axios";
import { fold } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import TRemoteServiceErrorHandler from "types/TRemoteServiceErrorHandler";
import Axios, { AxiosError } from "axios";
import TGetRequestType from "types/TGetRequestType";
import { left, right } from "fp-ts/lib/Either";
import IDataProvider from "types/IDataProvider";
import TData from "types/TData";

class Remote implements IDataProvider {
  api: AxiosInstance = Axios.create({
    baseURL: "http://localhost:5000",
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
  private getRequest: TGetRequestType<TData> = async (url) => {
    const { api } = this;
    try {
      const response = await api.get<any, AxiosResponse<TData>>(url);
      return right(response);
    } catch (e) {
      return left(e as AxiosError<TData>);
    }
  };

  public getData = async (errorHandler: TRemoteServiceErrorHandler<TData>) => {
    return pipe(
      await this.getRequest("/data"),
      fold(
        flow(errorHandler, () => null),
        (response) => response.data
      )
    );
  };
}

export default Remote;
