import { AxiosInstance } from "axios";
import { fold } from "fp-ts/lib/Either";
import { flow, pipe } from "fp-ts/lib/function";
import TRemoteServiceErrorHandler from "types/TRemoteServiceErrorHandler";
import getRequest from "./api";
import Axios from "axios";
import TGetRequestType from "types/TGetRequestType";
import { left, right } from "fp-ts/lib/Either";

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
  private getRequest: TGetRequestType<TData> = async (url, config) => {
    const { api } = this;
    try {
      const response = await api.get(url, config);
      return right(response);
    } catch (e) {
      return left(e);
    }
  };

  public getData = async (errorHandler: TRemoteServiceErrorHandler<TData>) =>
    pipe(
      await getRequest("/data"),
      fold(
        flow(errorHandler, () => null),
        (response) => response.data
      )
    );
}
