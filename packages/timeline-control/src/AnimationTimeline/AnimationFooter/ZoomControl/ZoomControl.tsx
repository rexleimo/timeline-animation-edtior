import React, { useRef, MouseEvent } from "react";
import './style.less';
import { clamp, curry } from 'lodash';
import { useAtomAnimationConfig } from "../../../jotai";

export function ZoomControl() {

  const [config, setConfig] = useAtomAnimationConfig();

  const ref = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const cur = ref.current as HTMLDivElement;
    const axis = cur.querySelector('.axis') as HTMLDivElement;
    const startX = axis.clientLeft;
    const startWidth = cur.offsetLeft;

    document.onmousemove = function (m) {
      const endX = m.clientX;
      const diff = endX - startX;

      console.log(diff);
      

      const maxStartX = cur.offsetWidth;
      const targetWidth = clamp(diff - startWidth, 0, maxStartX - axis.clientWidth);

      axis.style.left = `${targetWidth}px`;
    }

    document.onmouseup = function (e) {
      document.onmousemove = null;
    }

  }

  return (
    <div className="zoom_control">
      <div className="sub_icon zoom_icon">
        +
      </div>
      <div className="control_container" ref={ref}>
        <div className="axis" onMouseDown={onMouseDown}></div>
      </div>
      <div className="add_icon zoom_icon">
        -
      </div>
    </div>
  );
}