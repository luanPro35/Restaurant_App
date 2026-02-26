import React, { useState, useCallback } from "react";
import { authApi } from "@/services/api/auth.api";
import { AdminUser } from "@/services/api/admin-user.api";

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.getProfile();
      setProfile(response);
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    profile,
    error,
    fetchProfile,
  };
};
