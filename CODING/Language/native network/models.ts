import { BaseResource } from 'models';

interface Info {
  page: number;
  totalRecords: number;
}

export interface Response {
  data: BaseResource[];
  info: Info;
}

export interface ResponseSingle {
  data: BaseResource;
  info: Info;
}

export interface Resource {
  payload: Response[] | undefined;
  uniqueTagIds: number[];
  isNextQueryAllowed: boolean;
  isLoading: boolean;
  isError: boolean;
  isValidating?: boolean;
  size?: number;
  setSize?: (size: number) => void;
}

export interface ResourceById {
  payload: ResponseSingle | undefined;
  isLoading: boolean;
  isError: boolean;
}
