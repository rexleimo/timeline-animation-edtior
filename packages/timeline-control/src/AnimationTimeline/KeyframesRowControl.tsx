import React, { MouseEvent, useRef, useEffect, useContext } from 'react';
import './style.less';
import { KeyframesRowControlParams } from './types/KeyframesRowControlParams';
import { maxBy, minBy, throttle } from 'lodash';
import { KeyframesData } from './types/KeyframesData';
import { useAnimationTimeMap, useAnimationTimeScrollLeft } from '../jotai/AnimationTimeMap';
import { useAtomAnimationConfig } from '../jotai';
import { ConfigMapKey, IScrollingConfig } from '../jotai/AnimationData';

export function KeyframesRowControl(props: KeyframesRowControlParams) {
  const { zoom, keyframesInfo } = props;

  const [config] = useAtomAnimationConfig();
  const [timeMap] = useAnimationTimeMap();
  const [timeLineScrollLeft] = useAnimationTimeScrollLeft();


  const curRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const timeLineScrollLeftRef = useRef(0);

  const timeMapRef = useRef<Map<number, number>>(new Map());

  const scrollConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;

  const onMouseDown = (e: MouseEvent<HTMLElement>) => {

    const cur = e.target as HTMLDivElement;
    cur.classList.add('active');

    const control = controlRef.current as HTMLDivElement;

    const startX = cur.clientLeft + cur.clientWidth / 2 - control.clientLeft;
    const startWidth = cur.clientWidth;

    document.onmousemove = (e) => {
      const clientX = e.clientX;
      const diff = clientX - startX;
      control.style.width = `${timeLineScrollLeftRef.current + startWidth + diff - control.offsetLeft}px`;
    }

    document.onmouseup = (e) => {
      document.onmousemove = null;
      cur.classList.remove('active');
    }

  }

  const moveControl = (e: MouseEvent<HTMLElement>) => {
    const cur = controlRef.current as HTMLDivElement;
    const start_x = e.clientX;
    const start_left = cur.offsetLeft;


    document.onmousemove = (e) => {
      const client_x = e.clientX;
      const diff = client_x - start_x;
      const target_left = Math.max(0, start_left + diff);
      cur.style.left = `${target_left}px`;
    }

    document.onmouseup = (e) => {
      document.onmousemove = null;
    }

  }

  const onMouseLeft = (e: MouseEvent<HTMLDivElement>) => {

    const cur = e.target as HTMLDivElement;
    cur.classList.add('active');

    const control = controlRef.current as HTMLDivElement;
    const startX = control.offsetLeft;

    const startWidth = control.clientWidth;

    document.onmousemove = (e) => {
      const clientX = e.clientX;
      const targetWidth = startX - clientX + startWidth;
      control.style.width = `${targetWidth}px`;
      control.style.left = `${clientX}px`;
    }

    document.onmouseup = (e) => {
      cur.classList.remove('active');
      document.onmousemove = null;
      document.onmouseup = null;
    }

  }

  function getTargetClientX(min: KeyframesData): number {
    let resultX;
    let pre;
    for (const [time, x] of timeMap.entries()) {
      if (min.value <= time) {
        resultX = pre;
        break;
      }
      pre = x;
    }
    return resultX as number;
  }

  useEffect(() => {

    if (keyframesInfo.length === 0) return;

    const cur = controlRef.current as HTMLDivElement;
    const min = minBy(keyframesInfo, (o) => o.value) as KeyframesData;
    const max = maxBy(keyframesInfo, (o) => o.value) as KeyframesData;
    const startX = getTargetClientX(min);
    const endX = getTargetClientX(max);

    const wdith = endX - startX;

    // timeMap.values().next().value;
    const f_value = timeMap.values().next().value;

    cur.style.width = `${wdith}px`;
    cur.style.left = `${startX + f_value}px`;

  }, [zoom, timeMap])

  useEffect(() => {
    timeMapRef.current = timeMap;
  }, [timeMap])

  useEffect(() => {
    timeLineScrollLeftRef.current = timeLineScrollLeft;
  }, [timeLineScrollLeft]);

  useEffect(() => {
    const cur = curRef.current as HTMLDivElement;
    cur.style.width = `${scrollConfig.length}px`;
  }, [scrollConfig.length])


  return (

    <div className="row" ref={curRef}>
      <div
        className="keyframes_area_control"
        ref={controlRef}
      >
        <div className="left_btn control_btn" onMouseDown={onMouseLeft}></div>
        {/* <div className="line" onMouseDown={moveControl}></div> */}
        <div className="line"></div>
        <div className="right_btn control_btn" onMouseDown={onMouseDown}></div>
      </div>

    </div>
  );


}