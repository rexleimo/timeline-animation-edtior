import './style.less';
import React, { useEffect, useRef, useState, WheelEvent } from 'react';
import { KeyframesArea } from './KeyframesArea';
import { KeyframesValue } from './KeyframesValue';
import { TimeValueMapContext } from './jotai/timeValue';
import { clamp } from 'lodash';
import { AnimationMoveLine } from './AnimationMoveLine';
import { AnimationTimeLineFooter } from './AnimationFooter';
import { useAtomAnimationConfig } from '../jotai';
import { ConfigMapKey, ITimeLineConfig } from '../jotai/AnimationData';
import { setConfigValue } from '../utils/setConfigValue';


export function AnimationTimeline() {

  const [config, setConfig] = useAtomAnimationConfig();
  const [timeMap, setTimeMap] = useState(new Map());
  const [boxWidth, setBoxWidth] = useState(0);

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
        <AnimationMoveLine />

        <AnimationTimeLineFooter />

      </div>
    </TimeValueMapContext.Provider>

  );

}