const currentYear = new Date().getFullYear();

export const aniosAgricolas: string[] = Array.from({ length: 5 }, (_, i) => {
  const y = currentYear - i;
  return `${y}-${y + 1}`;
});
