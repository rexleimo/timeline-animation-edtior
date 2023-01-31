import React from "react";
import { KeyframesRowControl } from "./KeyframesRowControl";
import { KeyframesAreaParams } from "./types/KeyframesAreaParams";

export function KeyframesArea(props: KeyframesAreaParams) {

  const { zoom } = props;

  return (
    <>
      <div className="keyframes_area">
        <KeyframesRowControl zoom={zoom} keyframesInfo={[
          {
            value: 1000,
          },
          {
            value: 2000
          }
        ]} />
      </div>
    </>
  );
}