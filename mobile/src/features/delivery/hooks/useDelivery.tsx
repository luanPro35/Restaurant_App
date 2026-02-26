import { useMenu } from "@/features/menu/hooks/useMenu";

export const useDelivery = () => {
  const delivery = useMenu();
  return {
    ...delivery,
  };
};
