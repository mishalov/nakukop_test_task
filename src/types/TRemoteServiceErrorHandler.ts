import TServiceErrorArg from "./TServiceErrorArg";

type TRemoteServiceErrorHandler<TPredictedResponseType> = (
  e: TServiceErrorArg<TPredictedResponseType>
) => void;

export default TRemoteServiceErrorHandler;
