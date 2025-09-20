import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '~/app/config/pagination';

export type PaginatedResult<T> = {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type PaginationOptions = {
  page?: number;
  pageSize?: number;
};

export const getPagination = (options?: PaginationOptions) => {
  const page = options?.page && options.page > 0 ? options.page : DEFAULT_PAGE;
  const pageSize =
    options?.pageSize && options.pageSize > 0
      ? options.pageSize
      : DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { page, pageSize, skip, take };
};

export const createPaginatedResponse = <T>({
  items,
  totalItems,
  page,
  pageSize,
}: {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
}): PaginatedResult<T> => ({
  data: items,
  totalItems,
  totalPages: Math.ceil(totalItems / pageSize),
  currentPage: page,
  pageSize,
});
