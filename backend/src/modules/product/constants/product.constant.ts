export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export const PRODUCT_UNITS = [
  "đĩa",
  "bát",
  "con",
  "nồi",
  "mẹt",
  "ly",
  "chai",
  "lon",
];

export const PRICE_RANGES = {
  UNDER_50: { min: 0, max: 50000 },
  FROM_50_TO_150: { min: 50000, max: 150000 },
  OVER_150: { min: 150001, max: Number.MAX_SAFE_INTEGER },
};

export const PRODUCT_MESSAGES = {
  NOT_FOUND: "Không tìm thấy sản phẩm",
  CREATE_SUCCESS: "Tạo sản phẩm thành công",
  UPDATE_SUCCESS: "Cập nhật sản phẩm thành công",
  DELETE_SUCCESS: "Xóa sản phẩm thành công",
  ALREADY_EXISTS: "Sản phẩm đã tồn tại",
};
