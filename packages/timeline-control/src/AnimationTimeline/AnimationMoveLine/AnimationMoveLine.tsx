import React, { useContext, useEffect, useRef, MouseEvent } from "react";
import './style.less';
import { useAtomValue } from "jotai";
import CurClientXEvents from "../jotai/curClientXEvnet";
import { useAtomAnimationConfig } from "../../jotai";
import { ConfigMapKey, IScrollingConfig } from "../../jotai/AnimationData";
import { setConfigValue } from "../../utils/setConfigValue";
import { clamp } from 'lodash';
import { useAnimationTimeMap } from "../../jotai/AnimationTimeMap";

export function AnimationMoveLine() {
  const clientX = useAtomValue(CurClientXEvents);
  const [config, setConfig] = useAtomAnimationConfig();

  const scrollingConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;

  const [timeMap] = useAnimationTimeMap();
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = timeMap.get(0) as number;

    const cur = lineRef.current as HTMLDivElement;
    cur.style.left = `${Math.floor(left - 2)}px`;

  }, [lineRef, timeMap]);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const cur = lineRef.current as HTMLElement;
    const startLeft = cur.offsetLeft;

    document.onmousemove = (m) => {
      const endX = m.clientX;
      const diff = endX - startX;
      const targetLeft = startLeft + diff;
      let timeKey = 0;
      let calculationLeft = 0;
      console.log(timeMap);
      // 向上取整 给 row
      for (const [key, val] of timeMap.entries()) {
        if (targetLeft <= val) {
          timeKey = key;
          calculationLeft = val;
          cur.style.left = `${val - 2}px`;
          break;
        }
      }
      console.log(timeKey);
    }

    document.onmouseup = () => {
      document.onmousemove = null;
    }

  }

  const moveLineHandle = (moveLeftPercentage: number) => {
    let scrollLeft = scrollingConfig.scrollLeft;
    if (moveLeftPercentage > 0.9) {
      scrollLeft += 4;
    } else if (moveLeftPercentage < 0.1) {
      scrollLeft -= 4;
    } else {
    }
    scrollingConfig.scrollLeft = clamp(scrollLeft, 0, scrollingConfig.clientWidth - scrollingConfig.scrollWidth);
    setConfigValue(setConfig, {
      [ConfigMapKey.SCROLLING]: scrollingConfig
    });
  }


  useEffect(() => {
    const cur = lineRef.current as HTMLElement;
    cur.style.left = `${clientX}px`;
  }, [clientX])

  return (
    <div className="animation_move_lien" ref={lineRef}>
      <div className="cap" onMouseDown={onMouseDown}></div>
    </div>
  );
}