import React, { MouseEvent, useRef, useEffect, useContext, useState, useCallback } from 'react';
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
import { DomUtils } from '../utils/dom';

export function KeyframesRowControl(props: KeyframesRowControlParams) {
  const { keyframesInfo, idx } = props;

  const [config] = useAtomAnimationConfig();
  const [timeMap] = useAnimationTimeMap();
  const [timeLineScrollLeft] = useAnimationTimeScrollLeft();
  const zoom = config[ConfigMapKey.ZOOM_VALUE];


  const curRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const timeLineScrollLeftRef = useRef(0);
  const timeMapRef = useRef<Map<number, number>>(new Map());

  const timeConfig = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;

  const [lists, setLists] = useState<any[]>([]);


  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const cur = e.target as HTMLDivElement;
    cur.classList.add('active');
    const clientWidth = cur.offsetWidth;

    document.onmousemove = (e) => {
      const clientX = e.clientX;
      const timeLeft = getTargetClientXCeilByLeft(clientX + timeLineScrollLeftRef.current);
      console.log(timeLeft);
      cur.style.left = `${timeLeft - 5}px`;
    }

    document.onmouseup = (e) => {
      document.onmousemove = null;
      cur.classList.remove('active');
    }

  }

  const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>, idx: number) => {
    onMouseMove(e);
  }, [timeMap]);

  function getTargetClientXCeilByLeft(left: number) {
    const timeMap = timeMapRef.current;
    const values = Array.from(timeMap.values());
    let resultX = 0;
    for (let i = 0, j = values.length - 1; i < j; i++, j--) {
      const valL = values[i];
      const valR = values[j];
      if (left <= valL) {
        resultX = values[i - 1];
        break;
      }

      if (valR <= left) {
        resultX = values[j - 1];
        break;
      }
    }
    return resultX;
  }

  function getTargetClientXCeilByTime(val: KeyframesData): number {
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
    let startX = getTargetClientXCeilByTime(minPoint);
    let endX = getTargetClientXCeilByTime(maxPoint);
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
        left = getTargetClientXCeilByTime(keyframe) - 5;
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
    timeMapRef.current = timeMap;
  }, [timeLineScrollLeft, timeMap]);

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