export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("vi-VN") + "đ";
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const adminUtils = {
  formatCurrency,
  formatDate,
};
