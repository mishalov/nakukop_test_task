import Remote from "services";
import IServicesProvider from "types/IServicesProvider";

export const servicesProvider: IServicesProvider = new Remote();
/**
 * можно вынести и в `.env`, но раз уж использую TSовский файл для конфига провайдера сервисов
 * то буду использовать и для определения раздичных констант
 */
export const remoteBaseUrl = "http://localhost:5000";
