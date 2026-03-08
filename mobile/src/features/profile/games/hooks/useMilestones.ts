import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import milestoneApi from "../../../../services/api/milestone.api";
import packageApi from "../../../../services/api/package-api";

import { Milestone, MILESTONES } from "../constants/milestones";
import { useAuth } from "../../../../app/context/AuthContext";

export const useMilestones = () => {
  const [currentOrders, setCurrentOrders] = useState(0);
  const [claimedIds, setClaimedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated) {
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      const data = await milestoneApi.getProgress();
      setCurrentOrders(data.currentOrders);
      setClaimedIds(data.claimedIds);
    } catch (error) {
      console.warn("Fetch progress error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await packageApi.count();
      setCount(data);
    } catch (error) {
      console.warn("Fetch count error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClaim = async (milestone: Milestone) => {
    if (claimedIds.includes(milestone.id)) return;

    try {
      const result = await milestoneApi.claim(milestone.id);
      if (result.success) {
        setClaimedIds((prev) => [...prev, milestone.id]);
        Alert.alert(
          "Chúc mừng!",
          `Bạn đã nhận được phần thưởng ${milestone.reward} cho mốc ${milestone.label}.`,
          [{ text: "Tuyệt vời" }]
        );
        return true;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Có lỗi xảy ra khi nhận thưởng.";
      Alert.alert("Thông báo", message);
    }
    return false;
  };

  useEffect(() => {
    fetchProgress();
    fetchCount();
  }, [fetchProgress, fetchCount]);

  return {
    currentOrders,
    claimedIds,
    count,
    loading,
    fetchProgress,
    fetchCount,
    handleClaim,
  };
};
