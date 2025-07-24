export function shouldShowSeeMore(text) {
  if (!text) return false;
  if (text.length > 300) return true;
  return text.split(' ').some(word => word.length > 90);
}