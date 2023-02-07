import React, { MouseEvent, useRef, useEffect, useContext, useState } from 'react';
import './style.less';
import { KeyframesRowControlParams } from './types/KeyframesRowControlParams';
import { maxBy, minBy } from 'lodash';
import { KeyframesData } from './types/KeyframesData';
import { useAnimationTimeMap, useAnimationTimeScrollLeft } from '../jotai/AnimationTimeMap';
import { useAtomAnimationConfig } from '../jotai';
import { ConfigMapKey, IScrollingConfig } from '../jotai/AnimationData';
import classNames from 'classnames';
import { useGetcolumnwidth } from './utils/useGetRenderCellCount';

export function KeyframesRowControl(props: KeyframesRowControlParams) {
  const { keyframesInfo, idx } = props;

  const [config] = useAtomAnimationConfig();
  const [timeMap] = useAnimationTimeMap();
  const [timeLineScrollLeft] = useAnimationTimeScrollLeft();
  const zoom = config[ConfigMapKey.ZOOM_VALUE];

  const getColumnWidth = useGetcolumnwidth()


  const curRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const timeLineScrollLeftRef = useRef(0);

  const scrollConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
  const [lists, setLists] = useState<any[]>([]);



  const onMouseRight = (e: MouseEvent<HTMLDivElement>) => {
    const cur = e.target as HTMLDivElement;
    cur.classList.add('active');

    const control = controlRef.current as HTMLDivElement;

    const startX = cur.clientLeft + cur.clientWidth / 2 - control.clientLeft;
    const startWidth = cur.clientWidth;

    document.onmousemove = (e) => {
      const clientX = e.clientX;
      const diff = clientX - startX;
      const targetLeft = timeLineScrollLeftRef.current + startWidth + diff;
      control.style.width = `${targetLeft - control.offsetLeft}px`;
      cur.style.left = `${targetLeft}px`;
    }

    document.onmouseup = (e) => {
      document.onmousemove = null;
      cur.classList.remove('active');
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

  const onMouseDown = (e: MouseEvent<HTMLDivElement>, idx: number) => {
    if (idx === 0) {
      onMouseLeft(e)
    } else if (idx === keyframesInfo.length - 1) {
      onMouseRight(e);
    }
  }


  function getTargetClientX(min: KeyframesData): number {
    const times = Array.from(timeMap.keys());
    const targetIdx = times.findIndex((v) => v === min.value);
    const values = Array.from(timeMap.values());
    const resultX = values[targetIdx];
    return resultX as number;
  }

  useEffect(() => {

    if (keyframesInfo.length === 0) return;

    const cur = controlRef.current as HTMLDivElement;
    const minPoint = minBy(keyframesInfo, (o) => o.value) as KeyframesData;
    const maxPoint = maxBy(keyframesInfo, (o) => o.value) as KeyframesData;
    let startX = getTargetClientX(minPoint);
    let endX = getTargetClientX(maxPoint);
    let wdith = 0;
    if (isNaN(startX) && isNaN(endX)) {
      const timeCurMinLeft = Math.min(...timeMap.keys());
      const timeCurMaxLeft = Math.max(...timeMap.keys());
      // 不在区域的操作
      if (timeCurMinLeft > minPoint.value) {
        startX = 0;
      }
      if (timeCurMaxLeft < maxPoint.value) {
        endX = 10000;
      }

      wdith = endX - startX;
    } else {
      startX = isNaN(startX) ? 0 : startX;
      endX = isNaN(endX) ? 10000 : endX;
      wdith = endX - startX;
    }

    const scale = getColumnWidth();
    console.log(wdith);
    cur.style.width = `${wdith}px`;
    cur.style.left = `${startX + scale}px`;
  }, [zoom, timeMap])

  useEffect(() => {
    const showList: any[] = [];
    keyframesInfo.forEach((keyframe) => {
      const scale = getColumnWidth();

      let isShow = false;
      let left = 0;
      const timeCurMinLeft = Math.min(...timeMap.keys());
      const timeCurMaxLeft = Math.max(...timeMap.keys());
      if (timeCurMinLeft > keyframe.value || timeCurMaxLeft < keyframe.value) {
        isShow = false;
      }
      else {
        left = getTargetClientX(keyframe) - 5 + scale;
        isShow = true;
      }

      showList.push({
        left,
        isShow
      })
    });
    setLists(showList);
  }, [timeMap, timeLineScrollLeft])

  useEffect(() => {
    timeLineScrollLeftRef.current = timeLineScrollLeft;
  }, [timeLineScrollLeft]);

  useEffect(() => {
    const cur = curRef.current as HTMLDivElement;
    cur.style.width = `${scrollConfig.length}px`;
  }, [scrollConfig.length]);


  return (

    <div className="row" ref={curRef}>
      <div
        className="keyframes_area_control"
        ref={controlRef}
      >
        <div className="line"></div>
        {/* <div className="left_btn control_btn" ></div> */}
        {/* <div className="line" onMouseDown={moveControl}></div> */}
        {/* <div className="right_btn control_btn" onMouseDown={onMouseDown}></div> */}
      </div>

      {
        lists.map((keyframe, idx) => {
          return <div
            key={idx}
            className={
              classNames('control_btn')
            }
            style={{
              left: keyframe.isShow ? keyframe.left : -1000
            }}
            onMouseDown={(e) => onMouseDown(e, idx)}></div>
        })
      }

    </div>
  );


}