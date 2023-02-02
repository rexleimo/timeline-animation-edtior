import { atom, useAtom } from 'jotai';
import { KeyframesRowControlParams } from '../AnimationTimeline/types/KeyframesRowControlParams';

export const AnimationData = atom<KeyframesRowControlParams[]>([]);

export const AnimationConfig = atom<Map<string, any>>(new Map());

export const useAtomAnimationConfig = () => {
  return useAtom(AnimationConfig)
};