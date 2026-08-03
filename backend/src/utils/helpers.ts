export const excludePassword = <T extends { password?: string }>(
  user: T,
): Omit<T, "password"> => {
  const { password: _password, ...rest } = user;
  return rest;
};

export const getRouteId = (id: string | string[] | undefined): string => {
  if (Array.isArray(id)) {
    throw new TypeError("Route parameter must be a string");
  }
  return id as string;
};

export const generateOrderNumber = (): string =>
  `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
