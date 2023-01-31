import React, { useRef, useEffect, useContext } from "react";
import { KeyframesRowControl } from "./KeyframesRowControl";
import { KeyframesAreaParams } from "./types/KeyframesAreaParams";
import { TimeValueMapContext } from './jotai/timeValue';

export function KeyframesArea(props: KeyframesAreaParams) {

  const { zoom } = props;
  const area_ref = useRef<HTMLDivElement>(null);
  const { boxWidth } = useContext(TimeValueMapContext);

  return (
    <>
      <div className="keyframes_area" ref={area_ref} style={{ width: boxWidth }}>
        <KeyframesRowControl zoom={zoom} keyframesInfo={[
          {
            value: 100,
          },
          {
            value: 1500
          }
        ]} />
      </div>
    </>
  );
}