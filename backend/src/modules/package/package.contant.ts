export const PackageStatus = {
  CONFIRMED: "ĐÃ TIẾP NHẬN",
  COOKING: "ĐANG NẤU",
  DELIVERING: "ĐANG GIAO",
  RECEIVED: "ĐÃ GIAO",
  COMPLETED: "ĐÃ HOÀN THÀNH",
  CANCELED: "ĐÃ HỦY",
} as const;

export type PackageStatus = (typeof PackageStatus)[keyof typeof PackageStatus];