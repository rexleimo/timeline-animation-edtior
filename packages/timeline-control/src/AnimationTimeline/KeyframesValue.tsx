import React, { useRef, useEffect, useState, useContext, MouseEvent, UIEvent } from 'react';
import { KeyframesValueCell } from './KeyframesValueCell';
import './style.less';
import KeyframesValueParams from './types/KeyframesValueParams';
import { ceil, throttle } from 'lodash';
import { useAtom } from 'jotai';
import CurClientXEvents from './jotai/curClientXEvnet';

import { ConfigMapKey, IScrollingConfig, ITimeLineConfig, useAnimationData, useAtomAnimationConfig } from '../jotai/AnimationData';
import { setConfigValue } from '../utils/setConfigValue';
import { useGetcolumnwidth, useGetMaxCell, useGetRenderCellCount, useScrollCompoentLeft } from './utils/useGetRenderCellCount';
import { useAnimationTimeMap, useAnimationTimeScrollLeft } from '../jotai/AnimationTimeMap';


export function KeyframesValue(props: KeyframesValueParams) {

  const [, setClientX] = useAtom(CurClientXEvents);
  const [config, setConfig] = useAtomAnimationConfig();
  const [tableList] = useAnimationData();

  const keyframesAreaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [maxCell, setMaxCell] = useState<number>(0);
  const getMaxCell = useGetMaxCell();
  const getColumnwidth = useGetcolumnwidth();
  const [, setTimeMap] = useAnimationTimeMap();
  const [timeLineScrollLeft] = useAnimationTimeScrollLeft();

  const scrollingConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
  const timeLineConfig = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;
  const scaleSplitCount = scrollingConfig.scaleCount;

  const [rows, setRow] = useState<any[]>([]);
  const [emitRenderTime, setEmitRenderTime] = useState(0);

  useEffect(() => {
    const cur = keyframesAreaRef.current as HTMLDivElement;
    window.onresize = (e) => {
      if (cur.clientWidth > document.body.clientWidth) {
        return;
      }
    };
    return () => {
      window.onresize = null
    };
  }, []);

  const getCellHandle = () => {
    const count = getMaxCell();
    const page = Math.floor((count - 1) / (getPageSize() + 1));
    const clientWidth = timeLineConfig.clientWidth;
    const totalLen = page * clientWidth;
    const targetDom = keyframesAreaRef.current as HTMLDivElement;
    targetDom.style.width = `${totalLen}px`;

    scrollingConfig.length = totalLen;
    scrollingConfig.clientWidth = clientWidth;
    setConfigValue(setConfig, scrollingConfig);
    return {
      limit: getColumnwidth(),
      total: page
    }
  }

  useEffect(() => {
    const { total: count } = getCellHandle();
    setMaxCell(Math.floor(count));
  }, [config[ConfigMapKey.ZOOM_VALUE], tableList.length]);

  useEffect(() => {
    const { total, limit } = getCellHandle();
    scrollingConfig.page = {
      limit: limit,
      current: 1,
      total
    };
    setConfigValue(setConfig, scrollingConfig);
  }, [config[ConfigMapKey.MAX_TIME]]);

  useEffect(() => {
    const count = getMaxCell(emitRenderTime);
    const scaleWidth = getColumnwidth();
    const totalLen = count * scaleWidth;
    const targetDom = keyframesAreaRef.current as HTMLDivElement;
    targetDom.style.width = `${totalLen}px`;

    scrollingConfig.length = totalLen;

  }, [emitRenderTime]);


  // 更新
  useEffect(() => {
    const rows: any[] = [];
    let map = new Map<number, number>();
    const curZoom = config[ConfigMapKey.ZOOM_VALUE];
    const scale = getColumnwidth();
    const cur = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;
    const curZoomValue = curZoom * 1000;
    const cap = curZoomValue / scrollingConfig.scaleCount;

    const startIdx = Math.ceil(timeLineScrollLeft / scale);
    const endIdx = startIdx + Math.floor(cur.clientWidth / getColumnwidth());
    for (let idx = startIdx; idx < endIdx; idx++) {
      const showLabel = idx % scaleSplitCount == 0;
      const time_idx = curZoomValue * idx / scaleSplitCount;
      const label = ceil(time_idx / 1000, 3);
      const left = getColumnwidth() * (idx + 1);
      map.set(time_idx, left + 1);
      const row = {
        showLabel,
        label,
        left
      }
      rows.push(row);
    }
    setRow(rows);
    setTimeMap(map);
    setEmitRenderTime(() => endIdx * cap);
  }, [timeLineScrollLeft, maxCell])

  const getPageSize = () => {
    const cur = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;
    return cur.clientWidth / getColumnwidth();
  }

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const clientX = e.clientX;
    const scrollLeft = document.querySelector('.keyframes_area_box')?.scrollLeft;
    const ceil = Math.ceil(scrollLeft as number);
    setClientX(clientX + ceil);
  }

  return (

    <div className='keyframes_values'
      ref={keyframesAreaRef} onClick={onClick}>
      <div ref={scrollRef} >
        {
          rows.map((v, idx) => (
            <KeyframesValueCell {...v} key={idx} />
          ))
        }
      </div>

    </div>
  );
}




