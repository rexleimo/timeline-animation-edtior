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

const throttleUpdateMaxTime = throttle(() => {

}, 1000 / 24);

export function KeyframesValue(props: KeyframesValueParams) {

  const [, setClientX] = useAtom(CurClientXEvents);
  const [config, setConfig] = useAtomAnimationConfig();
  const [tableList] = useAnimationData();

  const keyframesAreaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [maxCell, setMaxCell] = useState<number>(0);
  const getRenderCellCount = useGetRenderCellCount();
  const getMaxCell = useGetMaxCell();
  const getColumnwidth = useGetcolumnwidth();
  const [, setTimeMap] = useAnimationTimeMap();
  const [timeLineScrollLeft] = useAnimationTimeScrollLeft();
  const scrolleLeftHandle = useScrollCompoentLeft();

  const scrollingConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
  const timeLineConfig = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;
  const scaleSplitCount = scrollingConfig.scaleCount;

  const [rows, setRow] = useState<any[]>([]);

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

  useEffect(() => {
    const count = getMaxCell();
    const page = (count - 1) / (getPageSize() + 1);
    const clientWidth = timeLineConfig.clientWidth;
    const totalLen = page * clientWidth;
    scrollingConfig.length = totalLen;
    const targetDom = keyframesAreaRef.current as HTMLDivElement;
    targetDom.style.width = `${totalLen}px`;
    scrollingConfig.clientWidth = clientWidth;

    scrollingConfig.page = {
      limit: getColumnwidth(),
      current: 1,
      total: page
    };
    setMaxCell(Math.floor(count));
  }, [config[ConfigMapKey.ZOOM_VALUE], tableList.length]);

  useEffect(() => {
    const count = getMaxCell();
    const page = (count - 1) / (getPageSize() + 1);
    const clientWidth = scrollingConfig.dom ? scrollingConfig.dom.clientWidth : 1;
    const totalLen = page * clientWidth;
    scrollingConfig.length = totalLen;
    const targetDom = keyframesAreaRef.current as HTMLDivElement;
    targetDom.style.width = `${totalLen}px`;

    scrollingConfig.page = {
      limit: getColumnwidth(),
      current: 1,
      total: page
    };
    setConfigValue(setConfig, scrollingConfig);

  }, [config[ConfigMapKey.MAX_TIME]])


  const scrollLeftEffect = (screenLeft: number) => {
    const rows: any[] = [];
    let map = new Map<number, number>();
    const curZoom = config[ConfigMapKey.ZOOM_VALUE];

    const { startIdx, endIdx } = getRenderCellCount(screenLeft, maxCell, scrolleLeftHandle);
    for (let idx = startIdx; idx < endIdx; idx++) {
      const showLabel = idx % scaleSplitCount == 0;
      const time_idx = 1000 * curZoom * idx / scaleSplitCount;
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
  }

  useEffect(() => {
    scrollLeftEffect(scrollingConfig.scrollLeft);
  }, [maxCell]);

  useEffect(() => {
    const rows: any[] = [];
    let map = new Map<number, number>();
    const curZoom = config[ConfigMapKey.ZOOM_VALUE];
    const scale = getColumnwidth();
    const cur = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;

    const startIdx = Math.ceil(timeLineScrollLeft / scale);
    const endIdx = startIdx + Math.floor(cur.clientWidth / getColumnwidth());
    for (let idx = startIdx; idx < endIdx; idx++) {
      const showLabel = idx % scaleSplitCount == 0;
      const time_idx = 1000 * curZoom * idx / scaleSplitCount;
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

    const isUpdateMaxTime = () => Math.max(endIdx * 1000, config[ConfigMapKey.MAX_TIME]);
    console.log(isUpdateMaxTime());

    setConfigValue(setConfig, {
      [ConfigMapKey.MAX_TIME]: isUpdateMaxTime()
    })

  }, [timeLineScrollLeft])

  const getPageSize = () => {
    const cur = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig
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




