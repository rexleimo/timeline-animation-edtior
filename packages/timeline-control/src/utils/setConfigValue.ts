
export function setConfigValue(
  setConfig: (args_0: { [x: number]: any; } | ((prev: { [x: number]: any; }) => { [x: number]: any; })) => void,
  value: any) {
  return setConfig((prv) => ({ ...prv, ...value }));
}
