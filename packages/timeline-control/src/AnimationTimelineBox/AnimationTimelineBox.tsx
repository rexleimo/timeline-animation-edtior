import React, { useEffect } from 'react';
import { AnimationTimelineArea } from '../AnimationTimelineArea';
import { AnimationTimelineBoxParams } from './types/AnimationTimelineBox';
import { useAtom } from 'jotai';
import { AnimationData } from '../jotai/AnimationData';
import { AnimationTimelineHeader } from '../AnimationTimelineHeader';
import { AnimationTimeLineFooter } from '../AnimationTimelineArea/AnimationFooter';

export function AnimationTimelineBox(props: AnimationTimelineBoxParams) {

  const [, setRow] = useAtom(AnimationData);

  const { rows } = props;

  useEffect(() => {
    setRow(rows);
  }, [rows])

  return (
    <>
      <AnimationTimelineHeader />
      <AnimationTimelineArea />
      <AnimationTimeLineFooter />
    </>
  );
}