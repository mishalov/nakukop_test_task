import Remote from "services";
import IServicesProvider from "types/IServicesProvider";

export const remoteBaseUrl = "http://localhost:5000";

export const servicesProvider: IServicesProvider = new Remote();

export const currenciesRefetchTime = 15000;
/**
 * можно вынести и в `.env`, но раз уж использую TSовский файл для конфига провайдера сервисов
 * то буду использовать и для определения раздичных констант
 */
