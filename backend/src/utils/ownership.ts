import AppError from "./error.js";

export const ensureOwnership = (
  resource: { userId: string | null },
  userId: string,
  resourceName: string,
) => {
  if (!resource.userId || resource.userId !== userId) {
    throw new AppError(
      `You do not have permission to access this ${resourceName}`,
      403,
      true,
    );
  }
};
