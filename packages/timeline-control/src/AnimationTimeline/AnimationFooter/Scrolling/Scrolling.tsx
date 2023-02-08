import React, { useEffect, useState, MouseEvent, useRef } from "react";
import { useAtomAnimationConfig } from "../../../jotai";
import { ConfigMapKey, IScrollingConfig } from "../../../jotai/AnimationData";
import { setConfigValue } from "../../../utils/setConfigValue";
import './style.less';
import { clamp, throttle } from 'lodash';

export function Scrolling() {
  const [config, setConfig] = useAtomAnimationConfig();

  const scrolling_config = config[ConfigMapKey.SCROLLING] as IScrollingConfig;

  const [max_len, setMaxLen] = useState(0);
  const [show, setShow] = useState(false);

  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const cur = ref.current as HTMLDivElement;
    const { length, clientWidth, page } = scrolling_config;

    if (clientWidth > length) {
      setShow(false);
    } else {
      setShow(true);
      const scroll_width = clientWidth / page.total;
      setMaxLen(scroll_width);

      setTimeout(() => {
        const control = cur.querySelector('.scrolling_control') as HTMLDivElement;
        scrolling_config.scrollWidth = control.offsetWidth;
        // setConfigValue(setConfig, scrolling_config);
      }, 0);
    }

  }, [scrolling_config.length]);

  const emitScrollingLeft = throttle((left) => {
    const scrolling_config = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
    scrolling_config.scrollLeft = left;
    setConfigValue(setConfig, scrolling_config);
  }, 0);

  const onScroll = (e: MouseEvent<HTMLDivElement>) => {
    const controlWidth = ref.current as HTMLDivElement;

    const target = e.target as HTMLDivElement;
    const startX = e.clientX;
    const startLeft = target.offsetLeft;

    document.onmousemove = function (e) {
      const clientX = e.clientX;
      const left = clamp(startLeft + clientX - startX, 0, controlWidth.offsetWidth - target.offsetWidth);
      target.style.left = `${left}px`;
      emitScrollingLeft(left);
    }

    document.onmouseup = function () {
      document.onmousemove = null;
    }

  }

  useEffect(() => {
    if (ref.current) {
      const scrolling_config = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
      scrolling_config.dom = ref.current;
      setConfigValue(setConfig, scrolling_config);
    }
  }, [ref]);

  return (
    <div className="scrolling_box" ref={ref}>
      <div
        style={{
          width: max_len,
          display: show ? 'block' : 'none',
          left: scrolling_config.scrollLeft
        }}
        className="scrolling_control" onMouseDown={onScroll}></div>
    </div>
  );
}