import './style.less';
import React, { useEffect, useRef, useState, WheelEvent } from 'react';
import { KeyframesArea } from './KeyframesArea';
import { KeyframesValue } from './KeyframesValue';
import { TimeValueMapContext } from './jotai/timeValue';
import { clamp, throttle } from 'lodash';
import { useAtomAnimationConfig } from '../jotai';
import { ConfigMapKey, IScrollingConfig, ITimeLineConfig } from '../jotai/AnimationData';
import { setConfigValue } from '../utils/setConfigValue';
import { useGetcolumnwidth, useGetMaxCell, useGetRenderCellCount } from './utils/useGetRenderCellCount';
import { DomUtils } from '../utils/dom';


const throttleScrollLeft = throttle(DomUtils.setDomScrollLeft, 1000 / 24);
export function AnimationTimelineArea() {

  const [config, setConfig] = useAtomAnimationConfig();
  const scrollingConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;

  const [timeMap, setTimeMap] = useState(new Map());
  const [boxWidth, setBoxWidth] = useState(0);

  const getRenderCellCount = useGetRenderCellCount();
  const getMaxCell = useGetMaxCell();
  const getColumnwidth = useGetcolumnwidth();

  const [zoom, setZoom] = useState(1);
  const doKeyCode = useRef('');

  const handelWheel = (deltaY: number, zoom: number) => {
    zoom += deltaY * -0.01;
    setZoom(clamp(zoom, 0.1, 10));
  };

  const keyframes_area_ref = useRef<HTMLDivElement>(null);

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    const wheel = e;
    const keyCode = 'Control';
    if (doKeyCode.current == keyCode) {
      handelWheel(wheel.deltaY, zoom);
    }
  };

  useEffect(() => {

    const onKeyDown = (e: globalThis.KeyboardEvent): void => {
      doKeyCode.current = e.key;
    };

    document.body.addEventListener('keydown', onKeyDown);

    const onKeyUp = (e: globalThis.KeyboardEvent): void => {
      doKeyCode.current = '';
    };

    document.body.addEventListener('keyup', onKeyUp)

    return () => {
      document.body.removeEventListener('keydown', onKeyUp);
      document.body.removeEventListener('keyup', onKeyUp);
    }

  }, [])

  useEffect(() => {
    const { startIdx } = getRenderCellCount(scrollingConfig.scrollLeft, getMaxCell());
    const cur = keyframes_area_ref.current as HTMLDivElement;
    const scrollLeft = getColumnwidth() * (startIdx);
    throttleScrollLeft(cur, scrollLeft);
  }, [scrollingConfig.scrollLeft]);

  useEffect(() => {
    if (keyframes_area_ref.current) {
      const timeLineConfig = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;
      timeLineConfig.clientWidth = keyframes_area_ref.current.offsetWidth;
      setConfigValue(setConfig, {
        [ConfigMapKey.TIME_LINE]: timeLineConfig
      })
    }
  }, [keyframes_area_ref])


  return (
    <TimeValueMapContext.Provider value={{ timeMap, setTimeMap, boxWidth, setBoxWidth }}>
      <div tabIndex={0} className='keyframes_area_box' onWheel={onWheel} ref={keyframes_area_ref}>
        <KeyframesValue />
        <KeyframesArea />
      </div>
    </TimeValueMapContext.Provider>

  );

}