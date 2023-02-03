import React, { useRef, useContext } from "react";
import { KeyframesRowControl } from "./KeyframesRowControl";
import { KeyframesAreaParams } from "./types/KeyframesAreaParams";
import { TimeValueMapContext } from './jotai/timeValue';
import { useAtom } from 'jotai';
import { AnimationData, ConfigMapKey, useAtomAnimationConfig } from "../jotai/AnimationData";

export function KeyframesArea(props: KeyframesAreaParams) {
  const [row] = useAtom(AnimationData);
  const [config] = useAtomAnimationConfig();

  const zoom = config[ConfigMapKey.ZOOM_VALUE];

  const area_ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="keyframes_area" ref={area_ref}>
        {
          row.map((r, idx) => {
            return <KeyframesRowControl key={idx} zoom={zoom} keyframesInfo={r.keyframesInfo} />
          })
        }
      </div>
    </>
  );
}