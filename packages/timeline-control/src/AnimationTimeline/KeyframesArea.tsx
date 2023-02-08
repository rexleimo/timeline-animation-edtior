import React, { useRef, useContext, useEffect } from "react";
import { KeyframesRowControl } from "./KeyframesRowControl";
import { KeyframesAreaParams } from "./types/KeyframesAreaParams";
import { TimeValueMapContext } from './jotai/timeValue';
import { useAtom } from 'jotai';
import { AnimationData, ConfigMapKey, useAtomAnimationConfig } from "../jotai/AnimationData";

export function KeyframesArea(props: KeyframesAreaParams) {
  const [row] = useAtom(AnimationData);
  const [config] = useAtomAnimationConfig();

  const areaRef = useRef<HTMLDivElement>(null);
  const scrollConfig = config[ConfigMapKey.SCROLLING];

  useEffect(() => {
    const cur = areaRef.current as HTMLDivElement;
    cur.style.width = `${scrollConfig.length}px`;
  }, [scrollConfig.length]);

  return (
    <>
      <div className="keyframes_area" ref={areaRef}>
        {
          row.map((r, idx) => {
            return <KeyframesRowControl
              idx={idx}
              key={idx}
              keyframesInfo={r.keyframesInfo} />
          })
        }
      </div>
    </>
  );
}