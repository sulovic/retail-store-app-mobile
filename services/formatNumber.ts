const formatNumber = (value: number, digits:number = 0): string => {
  return new Intl.NumberFormat("sr-RS", {
    minimumFractionDigits: digits,
    maximumFractionDigits: 2,
  }).format(value);
};

export default formatNumber;
