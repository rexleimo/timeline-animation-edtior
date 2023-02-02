import { atom, useAtom } from 'jotai';
import { KeyframesRowControlParams } from '../AnimationTimeline/types/KeyframesRowControlParams';

export enum ConfigMapKey {
  ZoomOpiont
}

export type ConfigMapKeyNumValueNum = Map<number, number>;

const ZoomOpiontMap = new Map<number, number>();
ZoomOpiontMap.set(1, 0.1);
ZoomOpiontMap.set(2, 0.5);
ZoomOpiontMap.set(3, 1);
ZoomOpiontMap.set(4, 1.5);
ZoomOpiontMap.set(5, 2);
ZoomOpiontMap.set(6, 2.5);
ZoomOpiontMap.set(7, 2.5);
ZoomOpiontMap.set(8, 3);
ZoomOpiontMap.set(9, 3.5);
ZoomOpiontMap.set(10, 4);


export const AnimationData = atom<KeyframesRowControlParams[]>([]);

const animationConfigDataMap = new Map();
animationConfigDataMap.set(
  ConfigMapKey.ZoomOpiont, ZoomOpiontMap);



export const AnimationConfig = atom<Map<number, any>>(animationConfigDataMap);

export const useAtomAnimationConfig = () => {
  return useAtom(AnimationConfig)
};