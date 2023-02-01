import { atom } from 'jotai';
import { KeyframesRowControlParams } from '../AnimationTimeline/types/KeyframesRowControlParams';

export const AnimationData = atom<KeyframesRowControlParams[]>([]);