import { Either } from "fp-ts/lib/Either";
import TServiceErrorArg from "./TServiceErrorArg";
import TServiceResponse from "./TServiceResponse";

type TGetRequestType<PredictedResponseType> = (
  url: string
) => Promise<Either<TServiceErrorArg<PredictedResponseType>, TServiceResponse>>;

export default TGetRequestType;
