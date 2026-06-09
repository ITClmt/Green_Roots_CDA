export const formatPrice = (euros: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(euros);
