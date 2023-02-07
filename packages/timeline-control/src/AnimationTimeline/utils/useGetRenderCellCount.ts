import { ceil } from "lodash";
import { useAtomAnimationConfig } from "../../jotai";
import { ConfigMapKey, IScrollingConfig, ITimeLineConfig, useAnimationData } from "../../jotai/AnimationData";

export function useGetRenderCellCount() {
  const [config] = useAtomAnimationConfig();
  const getColumnwidth = useGetcolumnwidth();

  return (scrollLeft: number, max_cell: number) => {
    const scrollingConfig = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
    const maxWidth = scrollingConfig.clientWidth;
    const scrollWidth = ceil(scrollingConfig.scrollWidth);

    const target_width = ceil(maxWidth - (scrollWidth || 0), 2);
    let coefficient = scrollLeft / target_width;

    const startIdx = Math.floor(coefficient * max_cell);
    const cur = config[ConfigMapKey.TIME_LINE] as ITimeLineConfig;
    const endIdx = startIdx + Math.floor(cur.clientWidth / getColumnwidth());

    return {
      startIdx,
      endIdx
    }
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

  return () => {
    const maxTime = config[ConfigMapKey.MAX_TIME];
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
