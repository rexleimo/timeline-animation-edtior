import './style.less';
import React, { useEffect, useRef, useState, WheelEvent, UIEvent } from 'react';
import { KeyframesArea } from './KeyframesArea';
import { KeyframesValue } from './KeyframesValue';
import { clamp, throttle } from 'lodash';
import { useAtomAnimationConfig } from '../jotai';
import { ConfigMapKey, IScrollingConfig, ITimeLineConfig } from '../jotai/AnimationData';
import { setConfigValue } from '../utils/setConfigValue';
import { useGetcolumnwidth, useGetMaxCell, useGetRenderCellCount, useScrollCompoentLeft } from './utils/useGetRenderCellCount';
import { DomUtils } from '../utils/dom';
import { useAnimationTimeScrollLeft } from '../jotai/AnimationTimeMap';


const throttleScrollLeft = throttle(DomUtils.setDomScrollLeft, 1000 / 24);
export function AnimationTimelineArea() {

  const [config, setConfig] = useAtomAnimationConfig();
  const [, setTimeLineScrollerLeft] = useAnimationTimeScrollLeft();
  const scrolleLeftHandle = useScrollCompoentLeft();

  const scrollingConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;

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
    const { startIdx } = getRenderCellCount(scrollingConfig.scrollLeft, getMaxCell(), scrolleLeftHandle);
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

  const onScroll = (ev: UIEvent<HTMLDivElement>) => {
    const target = ev.target as HTMLDivElement;
    const scrollLeft = target.scrollLeft;
    setTimeLineScrollerLeft(scrollLeft);
  }


  return (
    <div tabIndex={0} className='keyframes_area_box'
      onScroll={onScroll}
      onWheel={onWheel} ref={keyframes_area_ref}>
      <KeyframesValue />
      <KeyframesArea />
    </div>
  );

}