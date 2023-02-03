import React, { useRef, MouseEvent, useEffect } from "react";
import './style.less';
import { clamp, ceil } from 'lodash';
import { useAtomAnimationConfig } from "../../../jotai";
import { ConfigMapKey, ConfigMapKeyNumValueNum } from "../../../jotai/AnimationData";
import { setConfigValue } from "../../../utils/setConfigValue";

export function ZoomControl() {

  const [config, setConfig] = useAtomAnimationConfig();

  useEffect(() => {
    const cur = ref.current as HTMLDivElement;
    const axis = cur.querySelector('.axis') as HTMLDivElement;
    axis.style.left = `26px`;
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const cur = ref.current as HTMLDivElement;
    const axis = cur.querySelector('.axis') as HTMLDivElement;
    const startX = axis.clientLeft;
    const startWidth = cur.offsetLeft;

    document.onmousemove = function (m) {
      const endX = m.clientX;
      const diff = endX - startX;

      const maxStartX = cur.offsetWidth;
      const targetLeft = clamp(diff - startWidth, 0, maxStartX - axis.clientWidth);

      axis.style.left = `${targetLeft}px`;

      const option = ceil(targetLeft / cur.clientWidth, 1) * 10;

      const zoomControlOption = config[ConfigMapKey.ZOOM_OPTION] as ConfigMapKeyNumValueNum;
      const targetZoom = zoomControlOption[option];

      setConfigValue(setConfig, { [ConfigMapKey.ZOOM_VALUE]: targetZoom });

    }

    document.onmouseup = function () {
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