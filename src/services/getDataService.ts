import { fold } from "fp-ts/lib/Either";
import { pipe, flow } from "fp-ts/lib/function";
import getRequest from "./api";
import TRemoteServiceErrorHandler from "types/TRemoteServiceErrorHandler";

const getDataService = async (
  errorHandler: TRemoteServiceErrorHandler<TData>
) =>
  pipe(
    await getRequest("/data"),
    fold(
      flow(errorHandler, () => null),
      (response) => response.data
    )
  );

export default getDataService; //PredictedResponseType
