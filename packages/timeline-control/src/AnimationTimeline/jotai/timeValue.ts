import React from "react";

/**
 * @ 时间轴线上对应的时间轴
 * Map 时间线 index 时间value
 */
export const TimeValueMapContext = React.createContext<
  {
    timeMap: { [x: number]: number },
    setTimeMap?: any,
    boxWidth?: number,
    setBoxWidth?: any
  }
>(
  {
    timeMap: {}
  }
);