export const capitalHalls = Array.from({ length: 10 }, (_, i) => {
  const hallNum = 10 - i; // ১০ থেকে ১ পর্যন্ত ক্যাপিটাল হল
  return {
    id: `capital-hall-${hallNum}`,
    name: `Capital Hall ${hallNum}`,
    image: `/coc/capital-peak/all-hall/capital-hall/Capital_Hall_${hallNum}.webp`,
    route: `/capital-peak/capital-hall-${hallNum}`
  };
});