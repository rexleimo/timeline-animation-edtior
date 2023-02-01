import React, { useEffect } from 'react';
import { AnimationTimeline } from '../AnimationTimeline';
import { AnimationTimelineBoxParams } from './types/AnimationTimelineBox';
import { useAtom } from 'jotai';
import { AnimationData } from '../jotai/AnimationData';

export function AnimationTimelineBox(props: AnimationTimelineBoxParams) {

  const [, setRow] = useAtom(AnimationData);

  const { rows } = props;

  useEffect(() => {
    setRow(rows);
  }, [rows])

  return (
    <>
      <AnimationTimeline />
    </>
  );
}