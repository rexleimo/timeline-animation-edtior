import { atom, useAtom, useAtomValue } from 'jotai';
import { KeyframesRowControlParams } from '../AnimationTimelineArea/types/KeyframesRowControlParams';

export enum ConfigMapKey {
  ZOOM_OPTION,
  ZOOM_VALUE,
  MAX_TIME,
  SCROLLING,
  TIME_LINE
}

export type ConfigMapKeyNumValueNum = { [x: number]: number };
export interface IScrollingConfig {
  length: number;
  scrollLeft: number;
  scrollWidth: number;
  dom: HTMLDivElement;
  clientWidth: number;
  scaleWidth: number;
  scaleDefaultWidth: number;
  page: {
    limit: number,
    current: number,
    total: number,
  }
}

const ZoomOpiontMap = {
  0: 20,
  25: 10,
  50: 5,
  75: 1,
  100: 0.1,
}

// 默认最大时长
const DefualtMaxTime = 20 * 1000;

export const AnimationData = atom<KeyframesRowControlParams[]>([]);
const scaleDefaultWidth = 100;
const ScrollingConfig = {
  length: 0,
  scrollLeft: 0,
  scaleWidth: scaleDefaultWidth,
  scaleDefaultWidth,
};

export interface ITimeLineConfig {
  clientWidth: number;
}

const timeLineConfig = {
  clientWidth: 0
}

const animationConfigDataMap = {
  [ConfigMapKey.ZOOM_OPTION]: ZoomOpiontMap,
  [ConfigMapKey.ZOOM_VALUE]: 1,
  [ConfigMapKey.MAX_TIME]: DefualtMaxTime,
  [ConfigMapKey.SCROLLING]: ScrollingConfig,
  [ConfigMapKey.TIME_LINE]: timeLineConfig
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