import React, { useRef, useEffect, useState, useContext } from 'react';
import { KeyframesValueCell } from './KeyframesValueCell';
import './style.less';
import KeyframesValueParams from './types/KeyframesValueParams';
import { clamp } from 'lodash';
import { TimeValueMapContext } from './jotai/timeValue';

export function KeyframesValue(props: KeyframesValueParams) {

  let { timeMap, setTimeMap } = useContext(TimeValueMapContext);

  const { zoom } = props;

  const keyframes_area_ref = useRef<HTMLDivElement>(null);
  const [max_cell, setMaxCell] = useState<number>(0);
  const [scale_width, setScaleWidth] = useState(160);
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
    const cur = keyframes_area_ref.current as HTMLElement;
    const zoomWidth = clamp(cur?.clientWidth * zoom, document.body.clientWidth, document.body.clientWidth * 20);
    cur.style.width = `${Math.ceil(zoomWidth)}px`;

    setScaleWidth((pre) => {
      return Math.min(Math.max(160 / 4, pre * zoom), 160 * 4);
    });
  }, [zoom])

  useEffect(() => {
    const cur = keyframes_area_ref.current as HTMLElement;
    const cell_width = Math.ceil(cur.clientWidth / getcolumnwidth());
    const set_max_cell = cell_width % 2 === 0 ? cell_width : cell_width - 1;
    setMaxCell(set_max_cell);
  }, [scale_width])

  useEffect(() => {
    let map = {};
    const items = keyframes_area_ref.current?.querySelectorAll('.keyframes_values_cell') as unknown as HTMLElement[];
    items?.forEach((v, idx: number) => {
      map = Object.assign({}, map, { [idx * 100]: v.offsetLeft });
    });
    setTimeMap(map);

  }, [zoom, max_cell])

  const getcolumnwidth = () => {
    return scale_width / scale_split_count;
  }

  const gridColumnRender = () => {
    const cells: any[] = [];
    let label = 0;
    for (let i = 0; i < max_cell; i++) {
      const isLabel = i % scale_split_count == 0;
      const item = <KeyframesValueCell key={i} showLabel={isLabel} label={`${label}S`} />
      cells.push(item);
      if (isLabel) label++;
    }
    return cells;
  }


  return (

    <div className='keyframes_values' ref={keyframes_area_ref}
      style={{ gridTemplateColumns: `repeat(auto-fill, ${getcolumnwidth()}px)` }}>
      {gridColumnRender()}

    </div>
  );
}

