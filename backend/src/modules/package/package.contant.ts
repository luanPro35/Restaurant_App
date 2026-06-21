export const PackageStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
} as const;

export type PackageStatus = (typeof PackageStatus)[keyof typeof PackageStatus];