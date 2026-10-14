import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import milestoneApi, { MilestoneProgress } from "../../../../services/api/milestone.api";
import packageApi from "../../../../services/api/package-api";
import { Milestone, MILESTONES } from "../constants/milestones";
import { useAuth } from "../../../../app/context/AuthContext";

export const useMilestones = () => {
  const [currentOrders, setCurrentOrders] = useState(0);
  const [claimedIds, setClaimedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [cycleMonth, setCycleMonth] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [resetDate, setResetDate] = useState("");
  const [isMaxReached, setIsMaxReached] = useState(false);

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
      if (data.packageCount !== undefined) {
        setCount(data.packageCount);
      }
      setCycleMonth(data.cycleMonth || "");
      setDaysRemaining(data.daysRemaining || 0);
      setResetDate(data.resetDate || "");
      setIsMaxReached(data.isMaxReached || false);
    } catch (error) {
      console.warn("Fetch progress error:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await packageApi.count();
      setCount(data);
    } catch (error) {
      console.warn("Fetch count error:", error);
    }
  }, [isAuthenticated]);

  const handleClaim = async (milestone: Milestone) => {
    if (claimedIds.includes(milestone.id)) return false;

    try {
      const result = await milestoneApi.claim(milestone.id);
      if (result.success) {
        setClaimedIds((prev) => [...prev, milestone.id]);
        Alert.alert(
          "Chúc mừng!",
          `Bạn đã nhận được voucher thưởng ${milestone.reward} cho mốc ${milestone.label}. Phần thưởng có hiệu lực trong tháng này!`,
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

  const refreshAll = useCallback(() => {
    fetchProgress();
    fetchCount();
  }, [fetchProgress, fetchCount]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    currentOrders,
    claimedIds,
    count,
    loading,
    cycleMonth,
    daysRemaining,
    resetDate,
    isMaxReached,
    fetchProgress,
    fetchCount,
    refreshAll,
    handleClaim,
  };
};
