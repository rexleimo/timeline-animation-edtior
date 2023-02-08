import React, { MouseEvent, useRef, useEffect, useState, useCallback } from 'react';
import './style.less';
import { KeyframesRowControlParams } from './types/KeyframesRowControlParams';
import { maxBy, minBy } from 'lodash';
import { KeyframesData } from './types/KeyframesData';
import { useAnimationTimeMap, useAnimationTimeScrollLeft } from '../jotai/AnimationTimeMap';
import { useAtomAnimationConfig } from '../jotai';
import { useAnimationData, ConfigMapKey, ITimeLineConfig } from '../jotai/AnimationData';
import classNames from 'classnames';
import { VerifyNamespace } from '../utils/verify';
import { getOffsetLeft } from './utils/getOffsetLeft';

export function KeyframesRowControl(props: KeyframesRowControlParams) {
  const { keyframesInfo, idx: controlIdx } = props;
  const [row, setRows] = useAnimationData();

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


  const onMouseMove = (e: MouseEvent<HTMLDivElement>, idx: number) => {
    const cur = e.target as HTMLDivElement;
    cur.classList.add('active');
    let updateValue = 0;
    document.onmousemove = (e) => {
      const clientX = e.clientX;
      const { resultX: timeLeft, resutTime } = getTargetClientXCeilByLeft(clientX + timeLineScrollLeftRef.current);
      cur.style.left = `${timeLeft - 5}px`;
      updateValue = resutTime;
      const keyframesInfo = row[controlIdx as number].keyframesInfo;
      keyframesInfo[idx].value = updateValue;
      handeLineWidth(keyframesInfo);
    }

    document.onmouseup = (e) => {
      document.onmousemove = null;
      cur.classList.remove('active');
      row[controlIdx as number].keyframesInfo[idx].value = updateValue;
      setRows(row);
    }
  }

  const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>, idx: number) => {
    onMouseMove(e, idx);
  }, [timeMap]);

  function getTargetClientXCeilByLeft(left: number) {
    const timeMap = timeMapRef.current;
    const values = Array.from(timeMap.values());
    const times = Array.from(timeMap.keys());
    let resultX = 0, resutTime = 0;
    for (let i = 0, j = values.length - 1; i < j; i++, j--) {
      const valL = values[i];
      const valR = values[j];
      if (left <= valL) {
        resultX = values[i - 1];
        resutTime = times[i - 1];
        break;
      }

      if (valR <= left) {
        resultX = values[j + 1];
        resutTime = times[j + 1];
        break;
      }
    }
    return { resultX, resutTime };
  }

  function getTargetClientXCeilByTime(val: KeyframesData): number {
    const timeMap = timeMapRef.current;
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
        resultX = values[j];
        break;
      }
    }

    return resultX;
  }

  // 处理线段
  const handeLineWidth = (arr: KeyframesData[]) => {
    if (arr.length === 0) return;
    const timeMap = timeMapRef.current;
    const timeLineScrollLeft = timeLineScrollLeftRef.current;

    const cur = controlRef.current as HTMLDivElement;
    const minPoint = minBy(keyframesInfo, (o) => o.value) as KeyframesData;
    const maxPoint = maxBy(keyframesInfo, (o) => o.value) as KeyframesData;
    let startX = getTargetClientXCeilByTime(minPoint);
    console.log(startX);
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

      if (timeLineScrollLeft === 0 && VerifyNamespace.isNaN(wdith)) {
        wdith = 0;
      }

    } else {
      startX = VerifyNamespace.isUndefined(startX) ? 0 : startX;
      endX = VerifyNamespace.isUndefined(endX) ? timeConfig.clientWidth + timeLineScrollLeft + 50 : endX;
    }

    wdith = endX - startX - 5 * 2;

    cur.style.width = `${wdith}px`;
    cur.style.left = `${startX + 5}px`;
  }

  //点的处理
  const handleDotPositon = () => {
    const showList: any[] = [];

    keyframesInfo.forEach((keyframe, idx) => {

      let isShow = false;
      let left = -1000;
      const timeCurMinLeft = Math.min(...timeMap.keys());
      const timeCurMaxLeft = Math.max(...timeMap.keys());

      if (timeCurMinLeft > keyframe.value || timeCurMaxLeft < keyframe.value) {
        isShow = false;
      }
      else {
        const offsetLeft = getOffsetLeft(idx, keyframesInfo.length - 1);
        left = getTargetClientXCeilByTime(keyframe) - offsetLeft;
        isShow = true;
      }

      showList.push({
        left,
        isShow
      })
    });
    setLists(showList);
  }


  useEffect(() => {
    timeLineScrollLeftRef.current = timeLineScrollLeft;
    timeMapRef.current = timeMap;
    handeLineWidth(keyframesInfo);
    handleDotPositon();
  }, [timeLineScrollLeft, timeMap, zoom]);

  return (

    <div className="row" ref={curRef}>
      <div
        className="keyframes_area_control"
        ref={controlRef}
      >
        <div className="line"></div>
        {/* <div className="line" onMouseDown={moveControl}></div> */}
      </div>

      {
        lists.map((keyframe, idx) => {
          return <div
            key={idx}
            className={
              classNames('control_btn')
            }
            style={{
              left: !isNaN(keyframe.left) ? keyframe.left : -1000,
              zIndex: idx + 10
            }}
            onMouseDown={(e) => onMouseDown(e, idx)}></div>
        })
      }

    </div>
  );


}