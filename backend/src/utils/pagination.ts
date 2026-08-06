export interface PaginationMeta {
  total: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const buildPagination = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    total,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: end < total,
    hasPreviousPage: start > 0,
  };
};
