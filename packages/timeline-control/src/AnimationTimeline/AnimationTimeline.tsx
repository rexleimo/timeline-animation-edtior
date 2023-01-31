import './style.less';
import React, { KeyboardEvent, useRef, useState } from 'react';
import { KeyframesArea } from './KeyframesArea';
import { KeyframesValue } from './KeyframesValue';
import { TimeValueMapContext } from './jotai/timeValue';
import { throttle } from 'lodash';

export function AnimationTimeline() {

  const [timeMap, setTimeMap] = useState({});

  const [zoom, setZoom] = useState(1);
  const curWidth = useRef(0);

  const handelWheel = throttle((deltaY, zoom) => {
    zoom += deltaY * -0.1;
    setZoom(Math.min(Math.max(.125, zoom), 4));
  }, 1000 / 24);

  const keyframes_area_ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = keyframes_area_ref.current as HTMLDivElement;
    const keyCode = 'Shift';
    const curZoom = zoom;
    curWidth.current = cur.clientWidth;
    cur.onwheel = (wheel) => {
      if (keyCode == e.key) {
        handelWheel(wheel.deltaY, curZoom);
      }
    }

    cur.onkeyup = () => {
      cur.onwheel = null;
    }
  };


  return (
    <TimeValueMapContext.Provider value={{ timeMap, setTimeMap }}>
      <div tabIndex={0} className='keyframes_area' onKeyDown={onKeyDown} ref={keyframes_area_ref}>
        <KeyframesValue zoom={zoom} />
        <KeyframesArea zoom={zoom} />
      </div>
    </TimeValueMapContext.Provider>

  );

}