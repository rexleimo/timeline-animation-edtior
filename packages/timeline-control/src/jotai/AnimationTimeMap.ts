import { atom, useAtom } from 'jotai';

const AnimationTimeMap = atom<Map<number, number>>(new Map());
const AnimationTimeScrollLeft = atom(0);

export function useAnimationTimeMap() {
  return useAtom(AnimationTimeMap);
}

export function useAnimationTimeScrollLeft() {
  return useAtom(AnimationTimeScrollLeft);
}