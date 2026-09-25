// Đọc cấu hình Google OAuth an toàn từ biến môi trường .env (chuẩn bảo mật Expo)
export const GOOGLE_CONFIG = {
  WEB_CLIENT_ID:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    "122692853245-ehjn77rlg9nu7n1sanuf0bj87haejlkc.apps.googleusercontent.com",
  ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "",
  IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
};


export default GOOGLE_CONFIG;
