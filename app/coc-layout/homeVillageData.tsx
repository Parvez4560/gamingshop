export const homeHalls = Array.from({ length: 17 }, (_, i) => {
  const thNumber = 18 - i;
  return {
    id: `th-${thNumber}`,
    name: `Town Hall ${thNumber}`,
    image: `/coc/home-village/town-hall/Town_Hall_${thNumber}.webp`,
    route: `/clash-of-clans/th-${thNumber}`
  };
});