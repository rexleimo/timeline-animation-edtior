import { ceil } from "lodash";
import { useAtomAnimationConfig } from "../../jotai";
import { ConfigMapKey, IScrollingConfig, ITimeLineConfig, useAnimationData } from "../../jotai/AnimationData";

export function useGetRenderCellCount() {
  const renderCellScroll = useRenderCellScroll();
  return renderCellScroll;
}

function useRenderCellScroll() {
  const [config] = useAtomAnimationConfig();
  const getColumnwidth = useGetcolumnwidth();
  return (scrollLeft: number, maxCell: number, fn: (scrollLeft: number) => number) => {
    let coefficient = fn(scrollLeft);
    const startIdx = Math.floor(coefficient * maxCell);
    const cur = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;
    const endIdx = startIdx + Math.floor(cur.clientWidth / getColumnwidth());

    return {
      startIdx,
      endIdx
    }
  }
}

export function useScrollCompoentLeft() {
  const [config] = useAtomAnimationConfig();
  return (scrollLeft: number) => {
    const scrollingConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
    const maxWidth = scrollingConfig.clientWidth;
    const scrollWidth = ceil(scrollingConfig.scrollWidth);
    return scrollLeft / ceil(maxWidth - (scrollWidth || 0), 2);
  }
}

export function useGetcolumnwidth(): () => number {
  const [config] = useAtomAnimationConfig();
  return () => {
    const { scaleCount, scaleWidth } = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
    return scaleWidth / scaleCount;
  }
}

export function useGetMaxCell() {
  const [config] = useAtomAnimationConfig();
  const [tableList] = useAnimationData();

  return (timestamp?: number) => {
    const maxTime = timestamp ? timestamp : config[ConfigMapKey.MAX_TIME];
    const zoomValue = config[ConfigMapKey.ZOOM_VALUE];
    const all_values = tableList.reduce((result: number[], cur) => {
      const values = cur.keyframesInfo.map(v => v.value);
      return result.concat(values);
    }, []);
    const targetMaxTime = Math.max(...all_values, maxTime);

    // 目前是 1
    const scrollingConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
    // 目前的缩放值
    const cap = zoomValue * 1000 / scrollingConfig.scaleCount;
    const count = targetMaxTime / cap;
    return count;
  }
}
