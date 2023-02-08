import React, { MouseEvent, useRef, useEffect, useContext, useState } from 'react';
import './style.less';
import { KeyframesRowControlParams } from './types/KeyframesRowControlParams';
import { isUndefined, maxBy, minBy } from 'lodash';
import { KeyframesData } from './types/KeyframesData';
import { useAnimationTimeMap, useAnimationTimeScrollLeft } from '../jotai/AnimationTimeMap';
import { useAtomAnimationConfig } from '../jotai';
import { ConfigMapKey, IScrollingConfig, ITimeLineConfig } from '../jotai/AnimationData';
import classNames from 'classnames';
import { useGetcolumnwidth } from './utils/useGetRenderCellCount';
import { VerifyNamespace } from '../utils/verify';

export function KeyframesRowControl(props: KeyframesRowControlParams) {
  const { keyframesInfo, idx } = props;

  const [config] = useAtomAnimationConfig();
  const [timeMap] = useAnimationTimeMap();
  const [timeLineScrollLeft] = useAnimationTimeScrollLeft();
  const zoom = config[ConfigMapKey.ZOOM_VALUE];


  const curRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const timeLineScrollLeftRef = useRef(0);

  const scrollConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
  const timeConfig = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;

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

  function getTargetClientXCeil(val: KeyframesData): number {
    const times = Array.from(timeMap.keys());
    const values = Array.from(timeMap.values());
    let resultX = 0;
    for (let i = 0, j = times.length - 1; i < j; i++, j--) {
      const valL = times[i];
      const valR = times[j];
      if (val.value <= valL) {
        resultX = values[i];
        break;
      }

      if (valR <= val.value) {
        resultX = values[j + 1];
        break;
      }
    }

    return resultX;
  }

  useEffect(() => {

    if (keyframesInfo.length === 0) return;

    const cur = controlRef.current as HTMLDivElement;
    const minPoint = minBy(keyframesInfo, (o) => o.value) as KeyframesData;
    const maxPoint = maxBy(keyframesInfo, (o) => o.value) as KeyframesData;
    let startX = getTargetClientXCeil(minPoint);
    let endX = getTargetClientXCeil(maxPoint);
    let wdith = 0;
    if (VerifyNamespace.isUndefined(startX) && VerifyNamespace.isUndefined(endX)) {
      const timeCurMinLeft = Math.min(...timeMap.keys());
      const timeCurMaxLeft = Math.max(...timeMap.keys());
      // 不在区域的操作
      if (timeCurMinLeft > minPoint.value) {
        startX = 0;
      }
      if (timeCurMaxLeft < maxPoint.value) {
        endX = timeConfig.clientWidth + timeLineScrollLeft + 50;
      } else {
        endX = 0;
      }
      wdith = endX - startX;
      if (timeLineScrollLeft === 0 && VerifyNamespace.isNaN(wdith)) {
        wdith = 0;
      }

    } else {
      startX = VerifyNamespace.isUndefined(startX) ? 0 : startX;
      endX = VerifyNamespace.isUndefined(endX) ? timeConfig.clientWidth + timeLineScrollLeft + 50 : endX;
      wdith = endX - startX;
    }

    cur.style.width = `${wdith}px`;
    cur.style.left = `${startX}px`;
  }, [zoom, timeMap])

  useEffect(() => {
    const showList: any[] = [];
    keyframesInfo.forEach((keyframe) => {

      let isShow = false;
      let left = -1000;
      const timeCurMinLeft = Math.min(...timeMap.keys());
      const timeCurMaxLeft = Math.max(...timeMap.keys());

      if (timeCurMinLeft > keyframe.value || timeCurMaxLeft < keyframe.value) {
        isShow = false;
      }
      else {
        left = getTargetClientXCeil(keyframe) - 5;
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
              left: !isNaN(keyframe.left) ? keyframe.left : -1000
            }}
            onMouseDown={(e) => onMouseDown(e, idx)}></div>
        })
      }

    </div>
  );


}