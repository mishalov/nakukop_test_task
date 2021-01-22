import { AxiosResponse } from "axios";

type TServiceErrorArg<Response> = {
  code?: string;
  response?: AxiosResponse<Response>;
};

export default TServiceErrorArg;
