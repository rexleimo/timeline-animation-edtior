import { KeyframesAreaParams } from "./KeyframesAreaParams";
import { KeyframesData } from "./KeyframesData";

export interface KeyframesRowControlParams extends KeyframesAreaParams {
  idx?: number;
  keyframesInfo: KeyframesData[],
  // onChange: (idx: number, time: number) => void

}