import React, { MouseEvent, useRef, useEffect, useContext } from 'react';
import './style.less';
import { KeyframesRowControlParams } from './types/KeyframesRowControlParams';
import { maxBy, minBy } from 'lodash';
import { KeyframesData } from './types/KeyframesData';
import { TimeValueMapContext } from './jotai/timeValue';

export function KeyframesRowControl(props: KeyframesRowControlParams) {
  const { zoom, keyframesInfo } = props;

  const { timeMap } = useContext(TimeValueMapContext);

  const curRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: MouseEvent<HTMLElement>) => {

    let timer: number | null | undefined = null;
    const cur = e.target as HTMLDivElement;
    cur.classList.add('active');

    const row = curRef.current as HTMLDivElement;
    const control = row.querySelector('.keyframes_area_control') as HTMLElement;

    const startX = cur.clientLeft + cur.clientWidth / 2 - control.clientLeft;
    const startWidth = cur.clientWidth;

    row.onmousemove = (e) => {
      const clientX = e.clientX;
      const diff = clientX - startX;
      control.style.width = `${startWidth + diff - control.offsetLeft}px`;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        row.onmousemove = null;
        cur.classList.remove('active');
      }, 375);
    }
  }

  useEffect(() => {
    const cur = controlRef.current as HTMLDivElement;
    const min = minBy(keyframesInfo, (o) => o.value) as KeyframesData;
    const max = maxBy(keyframesInfo, (o) => o.value) as KeyframesData;

    const startX = timeMap[min.value] as number;
    const endX = timeMap[max.value] as number;
    const wdith = endX - startX;
    cur.style.width = `${wdith}px`;
    cur.style.left = `${startX + timeMap[100]}px`;

  }, [timeMap])

  return (
    <div className="row" ref={curRef}>

      <div
        className="keyframes_area_control"
        ref={controlRef}
      >
        <div className="left_btn control_btn"></div>
        <div className="line"></div>
        <div className="right_btn control_btn" onMouseDown={onMouseDown}></div>
      </div>

    </div>
  );
}