export function shorten(data: string | null, i: number, j: number, k: number) {
  if (!data) return "";

  if (data.length < k) return data;

  let a = data.toString().slice(0, i);
  let b = data.toString().slice(-j);

  return `${a}...${j ? b : ""}`;
}
