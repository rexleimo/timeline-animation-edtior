export function getOffsetLeft(value: number, len: number) {
  switch (value) {
    case 0:
      return -5;
    case len:
      return +5;
    default:
      return 0;
  }
}