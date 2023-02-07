import React, { useEffect, useRef, MouseEvent, useCallback } from "react";
import './style.less';
import { useAtomValue } from "jotai";
import CurClientXEvents from "../jotai/curClientXEvnet";
import { useAnimationTimeMap, useAnimationTimeScrollLeft } from "../../jotai/AnimationTimeMap";
import { AnimationMoveLineParams } from "../types/AnimationMoveLineParams";

export function AnimationMoveLine(props: AnimationMoveLineParams) {
  const clientX = useAtomValue(CurClientXEvents);

  const { height } = props;

  const [timeMap] = useAnimationTimeMap();
  const [timeLineScrollLeft] = useAnimationTimeScrollLeft();
  // 因为需要实时，避免闭包地狱
  const timeLineScrollLeftRef = useRef(0);
  const timeMapRef = useRef<Map<number, number>>(new Map());

  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = timeMap.get(0) as number;
    const cur = lineRef.current as HTMLDivElement;
    cur.style.left = `${Math.floor(left - 2)}px`;
  }, [lineRef, timeMap]);

  const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const cur = lineRef.current as HTMLElement;
    const startLeft = cur.offsetLeft;

    document.onmousemove = (m) => {
      const endX = m.clientX;
      const diff = endX - startX;
      const targetLeft = timeLineScrollLeftRef.current + startLeft + diff;
      let timeKey = 0;
      let calculationLeft = 0;

      for (const [key, val] of timeMapRef.current.entries()) {
        if (targetLeft <= val) {
          timeKey = key;
          calculationLeft = val;
          cur.style.left = `${val - 2 - timeLineScrollLeftRef.current}px`;
          break;
        }
      }
      console.log(timeKey);
    }

    document.onmouseup = () => {
      document.onmousemove = null;
    }

  }, [])


  useEffect(() => {
    const cur = lineRef.current as HTMLElement;
    cur.style.left = `${clientX}px`;
  }, [clientX])

  useEffect(() => {
    timeLineScrollLeftRef.current = timeLineScrollLeft;
  }, [timeLineScrollLeft])

  useEffect(() => {
    timeMapRef.current = timeMap;
  }, [timeMap])



  return (
    <div className="animation_move_lien" ref={lineRef} style={{ height: height - 42 - 20 }}>
      <div className="cap" onMouseDown={onMouseDown}></div>
    </div>
  );
}