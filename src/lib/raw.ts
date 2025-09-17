export function raw(item: any) {
  return JSON.parse(JSON.stringify(item));
}
