import { IP } from "./ip";

// Chuyển sang true để App kết nối tới Server Backend trên Render.com
const USE_RENDER_BACKEND = true;

export const Config = {
  ENV: USE_RENDER_BACKEND ? "production" : "development",
  API_URL: USE_RENDER_BACKEND
    ? "https://res-booking-backend.onrender.com"
    : `http://${IP}:4000`,
};
