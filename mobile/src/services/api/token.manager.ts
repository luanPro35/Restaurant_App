import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "accessToken";

let accessToken: string | null = null;
export const tokenManager = {
  // Called once at app startup to hydrate in-memory token from storage
  loadToken: async () => {
    try {
      const stored = await AsyncStorage.getItem(TOKEN_KEY);
      accessToken = stored;
      console.log(
        "🔑 [TokenManager] Loaded from storage:",
        stored ? "EXISTS" : "NULL",
      );
    } catch {
      accessToken = null;
    }
  },

  setToken: async (token: string | null) => {
    accessToken = token;
    try {
      if (token) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
      } else {
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
      console.log("🔑 [TokenManager] Saved token:", token ? "EXISTS" : "NULL");
    } catch (e) {
      console.warn("🔑 [TokenManager] Failed to persist token", e);
    }
  },

  // Sync getter — used by axios interceptor (reads in-memory cache)
  getToken: () => {
    return accessToken;
  },
};

export default tokenManager;
