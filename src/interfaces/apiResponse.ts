export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data: T & string;
}
