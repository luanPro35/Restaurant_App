import { productApi } from "../services/api/apiProducts";
export const seededShuffle = (array: any[], seed: string) => {
  const shuffled = [...array];
  let seedNum = 0;
  for (let i = 0; i < seed.length; i++) {
    seedNum += seed.charCodeAt(i);
  }

  const random = () => {
    const x = Math.sin(seedNum++) * 10000;
    return x - Math.floor(x);
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getDailySeed = () => {
  return new Date().toISOString().split("T")[0];
};
