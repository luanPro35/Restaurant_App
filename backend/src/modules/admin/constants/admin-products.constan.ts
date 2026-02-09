import { PRODUCT_MESSAGES } from "../../product/constants/product.constant";

export const ADMIN_PRODUCT_MESSAGES = {
  ...PRODUCT_MESSAGES,
  NOT_FOUND: "Không tìm thấy sản phẩm",
  CREATE_SUCCESS: "Tạo sản phẩm thành công",
  UPDATE_SUCCESS: "Cập nhật sản phẩm thành công",
  DELETE_SUCCESS: "Xóa sản phẩm thành công",
  ALREADY_EXISTS: "Sản phẩm đã tồn tại",
};
