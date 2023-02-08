import React, { useEffect, useRef, useState } from 'react';
import { AnimationTimelineArea } from '../AnimationTimeline';
import { AnimationTimelineBoxParams } from './types/AnimationTimelineBox';
import { useAtom } from 'jotai';
import { AnimationData } from '../jotai/AnimationData';
import { AnimationTimelineHeader } from '../AnimationTimelineHeader';
import { AnimationTimeLineFooter } from '../AnimationTimeline/AnimationFooter';
import { AnimationMoveLine } from '../AnimationTimeline/AnimationMoveLine';

export function AnimationTimelineBox(props: AnimationTimelineBoxParams) {

  const [, setRow] = useAtom(AnimationData);
  const ref = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  const { rows } = props;

  useEffect(() => {
    setRow(rows);
  }, [rows])

  useEffect(() => {
    if (ref.current) {
      setLineHeight((ref.current as HTMLDivElement).offsetHeight);
    }
  }, [ref])

  return (
    <div ref={ref}>
      <AnimationTimelineHeader />
      <AnimationTimelineArea />
      <AnimationTimeLineFooter />
      <AnimationMoveLine height={lineHeight} />
    </div>
  );
}