import React, { useRef, useEffect, useState, useContext, MouseEvent } from 'react';
import { KeyframesValueCell } from './KeyframesValueCell';
import './style.less';
import KeyframesValueParams from './types/KeyframesValueParams';
import { ceil } from 'lodash';
import { TimeValueMapContext } from './jotai/timeValue';
import { useAtom } from 'jotai';
import CurClientXEvents from './jotai/curClientXEvnet';

import { ConfigMapKey, IScrollingConfig, useAnimationData, useAtomAnimationConfig } from '../jotai/AnimationData';
import { setConfigValue } from '../utils/setConfigValue';

export function KeyframesValue(props: KeyframesValueParams) {

  let { setTimeMap } = useContext(TimeValueMapContext);
  const [, setClientX] = useAtom(CurClientXEvents);
  const [config, setConfig] = useAtomAnimationConfig();
  const [tableList] = useAnimationData();

  const keyframes_area_ref = useRef<HTMLDivElement>(null);
  const [max_cell, setMaxCell] = useState<number>(0);
  const [scale_width] = useState(160);

  const [rows, setRow] = useState<any[]>([]);

  const scale_split_count = 10;

  useEffect(() => {
    const cur = keyframes_area_ref.current as HTMLDivElement;
    window.onresize = (e) => {
      if (cur.clientWidth > document.body.clientWidth) {
        return;
      }
    };
    return () => {
      window.onresize = null
    };
  }, []);

  useEffect(() => {
    const max_time = config[ConfigMapKey.MAX_TIME];
    const zoom_value = config[ConfigMapKey.ZOOM_VALUE];

    const all_values = tableList.reduce((result: number[], cur) => {
      const values = cur.keyframesInfo.map(v => v.value);
      return result.concat(values);
    }, []);

    const target_max_time = Math.max(...all_values, max_time);
    // 目前是 1
    const scrolling_config = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
    // 目前的缩放值

    const cap = zoom_value * 1000 / scale_split_count;
    const count = target_max_time / cap;
    const page = (count - 1) / (getcolumnwidth() + 1);
    const clientWidth = scrolling_config.dom ? scrolling_config.dom.clientWidth : 1;
    scrolling_config.length = page * clientWidth;
    scrolling_config.clientWidth = clientWidth;

    scrolling_config.page = {
      limit: getcolumnwidth(),
      current: 1,
      total: page
    };

    setConfigValue(setConfig, scrolling_config);

    setMaxCell(Math.floor(count));

  }, [config[ConfigMapKey.ZOOM_VALUE], tableList.length])


  const getRenderCellCount = () => {
    const scrolling_config = config[ConfigMapKey.SCROLLING] as IScrollingConfig;
    const max_width = scrolling_config.clientWidth;
    const scroll_left = scrolling_config.scrollLeft;
    const scrollWidth = ceil(scrolling_config.scrollWidth);

    const target_width = ceil(max_width - (scrollWidth || 0), 2);
    let coefficient = scroll_left / target_width;

    const start_idx = Math.floor(coefficient * max_cell);
    const cur = keyframes_area_ref.current as HTMLElement;
    const end_idx = start_idx + Math.floor(cur.clientWidth / getcolumnwidth());

    return {
      start_idx,
      end_idx
    }

  }

  useEffect(() => {
    const rows: any[] = [];

    let map = new Map<number, number>();
    const cur_zoom = config[ConfigMapKey.ZOOM_VALUE];
    const { start_idx, end_idx } = getRenderCellCount();
    console.log(start_idx);

    let i = 0;
    for (let idx = start_idx; idx < end_idx; idx++) {
      const showLabel = idx % scale_split_count == 0;

      const time_idx = 1000 * cur_zoom * idx / scale_split_count;
      const label = ceil(time_idx / 1000, 3);
      const left = getcolumnwidth() * (i + 1);
      map.set(time_idx, left + 1);
      const row = {
        showLabel,
        label,
        left
      }
      rows.push(row);
      i++;
    }
    setRow(rows);
    setTimeMap(map);

  }, [config[ConfigMapKey.ZOOM_VALUE], (config[ConfigMapKey.SCROLLING] as IScrollingConfig).scrollLeft]);

  const getcolumnwidth = () => {
    return scale_width / scale_split_count;
  }

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const clientX = e.clientX;
    const scrollLeft = document.querySelector('.keyframes_area_box')?.scrollLeft;
    const ceil = Math.ceil(scrollLeft as number);
    setClientX(clientX + ceil);
  }


  return (

    <div className='keyframes_values' ref={keyframes_area_ref} onClick={onClick}>

      {
        rows.map((v, idx) => (
          <KeyframesValueCell {...v} key={idx} />
        ))
      }

    </div>
  );
}




