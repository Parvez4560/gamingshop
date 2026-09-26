export const builderHalls = Array.from({ length: 10 }, (_, i) => {
  const bhNumber = 10 - i;
  return {
    id: `bh-${bhNumber}`,
    name: `Builder Hall ${bhNumber}`,
    image: `/coc/builder-base/builder-hall/Builder_Hall_${bhNumber}.webp`,
    route: `/builder-base/bh-${bhNumber}`
  };
});