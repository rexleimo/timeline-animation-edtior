import React from "react";
import { ZoomControl } from "./ZoomControl/ZoomControl";
import './style.less';

export function AnimationTimeLineFooter() {
  return (
    <div className="timeline_zoom">
      <ZoomControl />
    </div>
  );
}