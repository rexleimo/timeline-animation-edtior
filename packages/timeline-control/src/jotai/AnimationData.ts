import { atom, useAtom, useAtomValue } from 'jotai';
import { KeyframesRowControlParams } from '../AnimationTimeline/types/KeyframesRowControlParams';

export enum ConfigMapKey {
  ZOOM_OPTION,
  ZOOM_VALUE,
  MAX_TIME,
  SCROLLING,
}

export type ConfigMapKeyNumValueNum = { [x: number]: number };
export interface IScrollingConfig {
  length: number;
  scrollLeft: number;
  dom: HTMLDivElement
}

const ZoomOpiontMap = {
  0: 0.05,
  1: 0.1,
  2: 0.5,
  3: 1,
  4: 1.5,
  5: 2,
  6: 2.5,
  7: 3,
  8: 3.5,
  9: 4,
  10: 4.5
}

// 默认最大时长
const DefualtMaxTime = 20 * 1000;

export const AnimationData = atom<KeyframesRowControlParams[]>([]);

const ScrollingConfig = {
  length: 0,
  scrollLeft: 0
};

const animationConfigDataMap = {
  [ConfigMapKey.ZOOM_OPTION]: ZoomOpiontMap,
  [ConfigMapKey.ZOOM_VALUE]: 1,
  [ConfigMapKey.MAX_TIME]: DefualtMaxTime,
  [ConfigMapKey.SCROLLING]: ScrollingConfig
};


export const AnimationConfig = atom<{ [x: number]: any }>(animationConfigDataMap);

export const useAtomAnimationConfig = () => {
  return useAtom(AnimationConfig)
};

export const useAtomAnimationConfigValue = () => {
  return useAtomValue(AnimationConfig);
}

export const useAnimationData = () => {
  return useAtom(AnimationData);
}