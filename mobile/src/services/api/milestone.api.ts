import api from "./axios.instance";

export interface MilestoneProgress {
  currentOrders: number;
  packageCount?: number;
  totalOrders?: number;
  claimedIds: number[];
  cycleMonth?: string;
  daysRemaining?: number;
  resetDate?: string;
  isMaxReached?: boolean;
}

export const milestoneApi = {
  // GET: /milestones/me
  getProgress: async (): Promise<MilestoneProgress> => {
    const response = await api.get("/milestones/me");
    return response.data;
  },

  // POST: /milestones/claim/:id
  claim: async (milestoneId: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/milestones/claim/${milestoneId}`);
    return response.data;
  },
};

export default milestoneApi;
