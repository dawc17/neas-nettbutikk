export const formatPrice = (price) => {
  if (!price) return "0 NOK";

  // Convert to string, then use regex to add spaces for thousands
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " NOK";
};
