export interface Milestone {
  id: number;
  threshold: number;
  reward: string;
  label: string;
  color: string;
  textColor: string;
}

export const MILESTONES: Milestone[] = [
  {
    id: 1,
    threshold: 3,
    reward: "10k",
    label: "3 đơn hàng",
    color: "#E07B39",
    textColor: "#FFF",
  },
  {
    id: 2,
    threshold: 5,
    reward: "20k",
    label: "5 đơn hàng",
    color: "#4A90E2",
    textColor: "#FFF",
  },
  {
    id: 3,
    threshold: 10,
    reward: "40k",
    label: "10 đơn hàng",
    color: "#8257E5",
    textColor: "#FFF",
  },
  {
    id: 4,
    threshold: 15,
    reward: "60k",
    label: "15 đơn hàng",
    color: "#F5A623",
    textColor: "#FFF",
  },
  {
    id: 5,
    threshold: 20,
    reward: "80k",
    label: "20 đơn hàng",
    color: "#7ED321",
    textColor: "#FFF",
  },
  {
    id: 6,
    threshold: 30,
    reward: "100k",
    label: "30 đơn hàng",
    color: "#D0021B",
    textColor: "#FFF",
  },
];
