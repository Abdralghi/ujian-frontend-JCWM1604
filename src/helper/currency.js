export const currencyFormatter = (number) => {
  var formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });
  number = number;
  return formatter.format(number);
};
