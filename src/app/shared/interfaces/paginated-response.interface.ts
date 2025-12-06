export interface PaginatedResponse<T> {
  page: number;
  size: number;
  itemsOnPage: number;
  count: number;
  totalPages: number;
  result: T[];
}
