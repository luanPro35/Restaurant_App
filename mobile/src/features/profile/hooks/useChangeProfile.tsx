import React from "react";
import { authApi } from "@/services/api/auth.api";

export const useChangeProfile = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<any>(null);

  const changeProfile = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.updateProfile(data);
      setData(response.user);
      return response.user;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { changeProfile, loading, error, data };
};
