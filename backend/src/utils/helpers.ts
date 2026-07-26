export const excludePassword = (user: any) => {
  const { password, ...rest } = user;
  return rest;
};
