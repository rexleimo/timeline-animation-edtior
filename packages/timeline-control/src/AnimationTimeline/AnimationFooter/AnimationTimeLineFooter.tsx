import React from "react";
import { ZoomControl } from "./ZoomControl/ZoomControl";
import './style.less';
import { Scrolling } from "./Scrolling";

export function AnimationTimeLineFooter() {
  return (
    <div className="timeline_footer">
      <ZoomControl />
      <Scrolling />
    </div>
  );
}