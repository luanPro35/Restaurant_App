import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useAuth } from "../../../app/context/AuthContext";
import authApi from "../../../services/api/auth.api";
import { GOOGLE_CONFIG } from "../../../config/google";

WebBrowser.maybeCompleteAuthSession();

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  title?: string;
}

export const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <Path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <Path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <Path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </Svg>
);

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  title = "Đăng nhập bằng Google",
}) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [inputClientId, setInputClientId] = useState(GOOGLE_CONFIG.WEB_CLIENT_ID);

  const getClientId = () => {
    return (
      inputClientId.trim() ||
      GOOGLE_CONFIG.WEB_CLIENT_ID ||
      (Platform.OS === "android"
        ? GOOGLE_CONFIG.ANDROID_CLIENT_ID
        : GOOGLE_CONFIG.IOS_CLIENT_ID)
    );
  };

  const handleStartRealGoogleOAuth = async (clientIdToUse: string) => {
    if (!clientIdToUse) {
      setShowConfigModal(true);
      return;
    }

    setLoading(true);
    setShowConfigModal(false);

    try {
      // 1. Redirect URI authorized in Google Cloud Console
      const googleRedirectUri = "https://auth.expo.io/@anonymous/mobile";

      // 2. Return URL for Expo to catch deep link back into the app
      const returnUrl = AuthSession.makeRedirectUri({
        scheme: "dolin",
      });

      // 3. Build Google authorization URL with response_type=code (Complies with Google's OAuth 2.0 policy)
      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientIdToUse)}` +
        `&redirect_uri=${encodeURIComponent(googleRedirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent("openid profile email")}` +
        `&prompt=select_account` +
        `&access_type=offline`;

      // 4. Wrap with Expo Auth proxy so accounts.google.com redirects to auth.expo.io which forwards back to returnUrl
      const startUrl =
        `https://auth.expo.io/@anonymous/mobile/start?` +
        `authUrl=${encodeURIComponent(googleAuthUrl)}` +
        `&returnUrl=${encodeURIComponent(returnUrl)}`;

      const result = await WebBrowser.openAuthSessionAsync(
        startUrl,
        returnUrl
      );

      if (result.type === "success" && result.url) {
        // Parse authorization code from the returned deep link
        const urlStr = result.url;
        let code = "";
        const queryIdx = urlStr.indexOf("?");
        const hashIdx = urlStr.indexOf("#");
        const paramString =
          queryIdx !== -1
            ? urlStr.substring(queryIdx + 1)
            : hashIdx !== -1
            ? urlStr.substring(hashIdx + 1)
            : "";

        paramString.split("&").forEach((part) => {
          const [key, value] = part.split("=");
          if (key === "code" && value) {
            code = decodeURIComponent(value);
          }
        });

        if (!code) {
          throw new Error("Không nhận được mã xác thực (code) từ Google.");
        }

        // Call backend server with authorization code to verify & exchange with Google, and sync to MySQL database
        const backendRes = await authApi.googleLogin({
          code,
          redirectUri: googleRedirectUri,
        });

        if (backendRes?.accessToken && backendRes?.user) {
          login(backendRes.accessToken, backendRes.user);
          Alert.alert(
            "Đăng nhập thành công",
            `Xin chào ${backendRes.user.name || backendRes.user.email}!`
          );
          if (onSuccess) onSuccess();
        } else {
          Alert.alert("Lỗi", "Không nhận được phiên đăng nhập từ máy chủ.");
        }
      } else if (result.type === "cancel") {
        console.log("User cancelled Google sign in");
      }
    } catch (error: any) {
      console.error("Real Google OAuth Error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể kết nối đến tài khoản Google.";
      Alert.alert("Lỗi Google OAuth", typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    const activeClientId = getClientId();
    if (!activeClientId) {
      setShowConfigModal(true);
    } else {
      handleStartRealGoogleOAuth(activeClientId);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={loading}
        className="w-full bg-white rounded-2xl py-4 px-5 flex-row items-center justify-center border border-[#E5D5C3] shadow-sm active:bg-gray-50"
      >
        {loading ? (
          <ActivityIndicator color="#E07B39" size="small" />
        ) : (
          <>
            <GoogleIcon size={22} />
            <Text className="ml-3 text-base font-bold text-[#2D2D2D]">
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Modal hướng dẫn & nhập Google Client ID nếu chưa có */}
      <Modal
        visible={showConfigModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfigModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="w-full bg-white rounded-3xl p-6 shadow-2xl border border-gray-100">
            <View className="items-center mb-4">
              <View className="w-14 h-14 rounded-2xl bg-orange-50 items-center justify-center mb-2 border border-orange-100">
                <GoogleIcon size={32} />
              </View>
              <Text className="text-xl font-black text-gray-900 text-center">
                Kết nối Google Cloud OAuth
              </Text>
              <Text className="text-xs text-gray-500 mt-1.5 text-center leading-4">
                Để mở trình duyệt chính thức của Google (accounts.google.com), bạn cần cung cấp <Text className="font-bold text-gray-800">Web Client ID</Text> từ Google Cloud Console.
              </Text>
            </View>

            <View className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 mb-4">
              <Text className="text-xs font-bold text-gray-700 mb-1">
                Các bước lấy Web Client ID miễn phí:
              </Text>
              <Text className="text-[11px] text-gray-500 leading-4">
                1. Truy cập: console.cloud.google.com{"\n"}
                2. Tạo project ➔ Credentials ➔ Create Credentials ➔ OAuth client ID.{"\n"}
                3. Chọn loại: <Text className="font-bold text-gray-700">Web application</Text>.{"\n"}
                4. Copy mã Client ID dạng: <Text className="font-mono text-[10px] text-orange-600">xxxx.apps.googleusercontent.com</Text>
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-gray-700 mb-1.5 uppercase">
                Dán Web Client ID của bạn vào đây:
              </Text>
              <TextInput
                value={inputClientId}
                onChangeText={setInputClientId}
                placeholder="xxxx.apps.googleusercontent.com"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                className="w-full bg-white rounded-xl px-3.5 py-3 text-xs border border-gray-300 font-mono text-gray-900"
              />
            </View>

            <TouchableOpacity
              onPress={() => handleStartRealGoogleOAuth(inputClientId.trim())}
              disabled={!inputClientId.trim()}
              className={`w-full py-3.5 rounded-2xl items-center mb-2.5 ${
                inputClientId.trim()
                  ? "bg-[#E07B39] shadow-md shadow-orange-500/20"
                  : "bg-gray-200 opacity-60"
              }`}
            >
              <Text className="text-white font-black text-sm">
                Mở màn hình đăng nhập Google thật
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowConfigModal(false)}
              className="w-full py-3 rounded-2xl bg-gray-100 items-center"
            >
              <Text className="text-gray-600 font-bold text-sm">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GoogleSignInButton;
