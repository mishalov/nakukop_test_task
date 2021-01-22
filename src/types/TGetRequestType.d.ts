type TGetRequestType<PredictedResponseType> = (
  url: string
) => Promise<Either<TServiceErrorArg<PredictedResponseType>, TServiceResponse>>;

export default TGetRequestType;
