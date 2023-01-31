import './style.less';
import React, { KeyboardEvent, useRef, useState } from 'react';
import { KeyframesArea } from './KeyframesArea';
import { KeyframesValue } from './KeyframesValue';

export function AnimationTimeline() {

  const [zoom, setZoom] = useState(1);
  const curWidth = useRef(0);

  const keyframes_area_ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const cur = keyframes_area_ref.current as HTMLDivElement;
    const keyCode = 'Shift';
    curWidth.current = cur.clientWidth;
    cur.onwheel = (wheel) => {
      if (keyCode == e.key) {
        const deltaY = wheel.deltaY;
        const newZoom = zoom + deltaY * -0.1;
        setZoom(Math.min(Math.max(.125, newZoom), 4));
      }
    }

    cur.onkeyup = () => {
      cur.onwheel = null;
    }
  };


  return (
    <div tabIndex={0} className='keyframes_area' onKeyDown={onKeyDown} ref={keyframes_area_ref}>
      <KeyframesValue zoom={zoom} />
      <KeyframesArea />
    </div>
  );

}