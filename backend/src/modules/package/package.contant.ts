export const PackageStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
} as const;

export type PackageStatus = (typeof PackageStatus)[keyof typeof PackageStatus];