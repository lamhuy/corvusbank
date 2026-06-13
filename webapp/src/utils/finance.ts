export const formatCurrency = (amountInCents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountInCents / 100);
};

export const calculateDailyInterest = (balanceInCents: number, apyPercent: number): number => {
  const dailyRate = (apyPercent / 100) / 365;
  return Math.floor(balanceInCents * dailyRate);
};
