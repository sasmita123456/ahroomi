// Standardized API response format
export interface StandardResponse<T = null> {
  data: T;
  outcome: boolean;
  message: string;
}