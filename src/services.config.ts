import Remote from "services";
import IServicesProvider from "types/IServicesProvider";

export const remoteBaseUrl = "http://localhost:5000";

export const servicesProvider: IServicesProvider = new Remote();

export const currenciesRefetchTime = 15000;
/**
 * This may be moved to `.env`, if refetch delay will be changed between environments
 */
