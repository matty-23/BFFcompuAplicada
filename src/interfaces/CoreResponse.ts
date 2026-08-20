export interface CoreResponse<T = any> {
  status: number;
  data: T;
  cookies?: string[];
}
