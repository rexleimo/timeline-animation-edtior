import React, { useRef, useContext } from "react";
import { KeyframesRowControl } from "./KeyframesRowControl";
import { KeyframesAreaParams } from "./types/KeyframesAreaParams";
import { TimeValueMapContext } from './jotai/timeValue';
import { useAtom } from 'jotai';
import { AnimationData } from "../jotai/AnimationData";

export function KeyframesArea(props: KeyframesAreaParams) {
  const [row] = useAtom(AnimationData);
  const { zoom } = props;
  const area_ref = useRef<HTMLDivElement>(null);
  const { boxWidth } = useContext(TimeValueMapContext);

  return (
    <>
      <div className="keyframes_area" ref={area_ref} style={{ width: boxWidth }}>
        {
          row.map((r, idx) => {
            return <KeyframesRowControl key={idx} zoom={zoom} keyframesInfo={r.keyframesInfo} />
          })
        }
      </div>
    </>
  );
}