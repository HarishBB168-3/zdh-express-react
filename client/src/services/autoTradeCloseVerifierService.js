export const getStocksWithOpenPositions = (posData) => {
  const data = posData.data.day;
  const stocksWithOpenPosition = data.filter((item) => item.quantity !== 0);

  return stocksWithOpenPosition;
};

export const closePositionsIfDayOver = (stockPositions) => {
  console.log("stockPositions :>> ", stockPositions);
};
