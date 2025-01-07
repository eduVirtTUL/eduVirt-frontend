export const convertMinutesToHoures = (minutes: number) => {
  const houres = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${houres}:${remainingMinutes <= 9 ? "0" + remainingMinutes : remainingMinutes}`;
};
