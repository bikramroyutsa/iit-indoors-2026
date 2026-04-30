export const getFontClass = (text: string | number | undefined | null) => {
  if (!text) return "";
  return String(text).includes('5') ? 'font-thalea' : '';
};
