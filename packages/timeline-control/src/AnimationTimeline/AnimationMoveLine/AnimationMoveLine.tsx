import React, { useContext, useEffect, useRef, MouseEvent } from "react";
import './style.less';
import { TimeValueMapContext } from '../jotai/timeValue'
import { useAtomValue } from "jotai";
import CurClientXEvents from "../jotai/curClientXEvnet";

export function AnimationMoveLine() {
  const clientX = useAtomValue(CurClientXEvents);

  const { timeMap } = useContext(TimeValueMapContext);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = timeMap[0];

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
      let timeKey;
      // 向上取整 给 row
      for (const key in timeMap) {
        const val = timeMap[key];
        if (targetLeft < val) {
          timeKey = key;
          cur.style.left = `${val}px`;
          break;
        }
      }
      console.log(timeKey);

    }

    document.onmouseup = () => {
      document.onmousemove = null;
    }

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