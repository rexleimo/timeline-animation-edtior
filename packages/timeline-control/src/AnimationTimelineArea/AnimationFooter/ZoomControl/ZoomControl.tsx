import React, { useRef, MouseEvent, useEffect } from "react";
import './style.less';
import { clamp, ceil } from 'lodash';
import { useAtomAnimationConfig } from "../../../jotai";
import { ConfigMapKey, ConfigMapKeyNumValueNum, IScrollingConfig } from "../../../jotai/AnimationData";
import { setConfigValue } from "../../../utils/setConfigValue";


export function ZoomControl() {

  const [config, setConfig] = useAtomAnimationConfig();

  useEffect(() => {
    const cur = ref.current as HTMLDivElement;
    const axis = cur.querySelector('.axis') as HTMLDivElement;
    axis.style.left = '75%';
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const cur = ref.current as HTMLDivElement;
    const axis = cur.querySelector('.axis') as HTMLDivElement;
    const startX = axis.clientLeft;
    const startWidth = cur.offsetLeft;
    const scrolling_config = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
    const startScaleWidth = scrolling_config.scaleDefaultWidth;

    document.onmousemove = function (m) {
      const endX = m.clientX;
      const diff = endX - startX;

      const maxStartX = cur.offsetWidth;
      const offsetWidth = maxStartX - axis.offsetWidth;
      const left = clamp(diff - startWidth, 0, offsetWidth);

      axis.style.left = `${left}px`;

      const zoomControlOption = config[ConfigMapKey.ZOOM_OPTION] as ConfigMapKeyNumValueNum;
      const percentage = Math.ceil(left / offsetWidth * 100)

      const option = zoomControlOptionHandle(percentage);
      const targetZoom = zoomControlOption[option];

      scrolling_config.scaleWidth = startScaleWidth + percentage * 2;
      setConfigValue(setConfig, {
        [ConfigMapKey.ZOOM_VALUE]: targetZoom,
        [ConfigMapKey.SCROLLING]: scrolling_config
      });
    }

    const zoomControlOptionHandle = (percentage: number): number => {
      if (0 <= percentage && percentage < 25) return 0;
      if (25 <= percentage && percentage < 50) return 25;
      if (50 <= percentage && percentage < 75) return 50;
      if (75 <= percentage && percentage < 100) return 75;
      if (percentage === 100) return 100;
      return 0;
    }

    document.onmouseup = function () {
      document.onmousemove = null;
    }

  }

  return (
    <div className="zoom_control">
      <div className="sub_icon zoom_icon">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23564" width="16" height="16"><path d="M977.216 908.8l-166.4-166.4a438.08 438.08 0 1 0-67.776 67.904l166.4 166.4a47.936 47.936 0 0 0 34.24 14.72 47.424 47.424 0 0 0 18.624-3.456 47.936 47.936 0 0 0 15.936-10.368 48.704 48.704 0 0 0-0.96-68.672zM128 469.76a341.184 341.184 0 1 1 99.904 241.344A341.44 341.44 0 0 1 128 469.76z" p-id="23565"></path><path d="M627.52 427.648H311.296a42.176 42.176 0 1 0 0 84.352H627.2a42.944 42.944 0 0 0 43.328-42.112 42.816 42.816 0 0 0-43.264-42.176z" p-id="23566"></path></svg>
      </div>
      <div className="control_container" ref={ref}>
        <div className="axis" onMouseDown={onMouseDown}></div>
      </div>
      <div className="add_icon zoom_icon">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23413" width="16" height="16">
          <path d="M977.216 908.8l-166.4-166.4a438.08 438.08 0 1 0-67.776 67.904l166.4 166.4a47.936 47.936 0 0 0 34.24 14.72 47.424 47.424 0 0 0 18.624-3.456 47.936 47.936 0 0 0 15.936-10.368 48.704 48.704 0 0 0-0.96-68.672zM128 469.76a341.184 341.184 0 1 1 99.904 241.344A341.44 341.44 0 0 1 128 469.76z" p-id="23414"></path><path d="M627.52 427.648H511.488V311.744a42.112 42.112 0 1 0-84.224 0v115.968H311.296a42.112 42.112 0 1 0 0 84.288h115.968v115.904a42.112 42.112 0 1 0 84.224 0V512H627.2a42.176 42.176 0 1 0 0-84.288z" p-id="23415"></path>
        </svg>
      </div>
    </div>
  );
}