import React, { useEffect, useState, UIEvent, useRef } from "react";
import { useAtomAnimationConfig } from "../../../jotai";
import { ConfigMapKey, IScrollingConfig } from "../../../jotai/AnimationData";
import { setConfigValue } from "../../../utils/setConfigValue";
import './style.less';

export function Scrolling() {
  const [config, setConfig] = useAtomAnimationConfig();

  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWidth(config[ConfigMapKey.SCROLLING].length);
  }, [config])

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const left = target.scrollLeft;
    const scrolling_config = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
    scrolling_config.scrollLeft = left;
    setConfigValue(setConfig, scrolling_config);
  }

  useEffect(() => {
    if (ref.current) {
      const scrolling_config = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
      scrolling_config.dom = ref.current;
      setConfigValue(setConfig, scrolling_config);
    }
  }, [ref])

  return (
    <div className="scrolling_box" ref={ref} onScroll={onScroll}>
      <div style={{ width }} ></div>
    </div>
  );
}