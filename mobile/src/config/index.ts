import { IP } from "./ip";

// Tự động: __DEV__ = true khi chạy npm start (Local), __DEV__ = false khi build app (Production).
// Nếu muốn dùng Render ngay trên máy Local, bạn chỉ cần đổi FORCE_RENDER = true.
const FORCE_RENDER = false;
const IS_PROD = !__DEV__ || FORCE_RENDER;

export const Config = {
  ENV: IS_PROD ? "production" : "development",
  API_URL: IS_PROD
    ? "https://res-booking-backend.onrender.com"
    : `http://${IP}:4000`,
};
