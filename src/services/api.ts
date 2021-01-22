import axios, { AxiosRequestConfig } from "axios";
import { Either, left, right } from "fp-ts/lib/Either";
import TGetRequestType from "types/TGetRequestType";

const api = axios.create({
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
const getRequest: TGetRequestType<TData> = async (url, config) => {
  try {
    const response = await api.get(url, config);
    return right(response);
  } catch (e) {
    return left(e);
  }
};

export default getRequest;
