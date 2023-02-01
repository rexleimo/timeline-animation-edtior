import React, { useRef, useEffect, useState, useContext, MouseEvent } from 'react';
import { KeyframesValueCell } from './KeyframesValueCell';
import './style.less';
import KeyframesValueParams from './types/KeyframesValueParams';
import { ceil, clamp } from 'lodash';
import { TimeValueMapContext } from './jotai/timeValue';
import { useAtom } from 'jotai';
import CurClientXEvents from './jotai/curClientXEvnet';

export function KeyframesValue(props: KeyframesValueParams) {

  let { setTimeMap, setBoxWidth } = useContext(TimeValueMapContext);
  const [, setClientX] = useAtom(CurClientXEvents);

  const { zoom = 1 } = props;

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

    const curWidth = cur.clientWidth;
    const diff = curWidth * zoom;

    const zoomWidth = clamp(curWidth + diff, document.body.clientWidth, document.body.clientWidth * 2);
    cur.style.width = `${Math.ceil(zoomWidth)}px`;
    setBoxWidth(cur.clientWidth);

    setScaleWidth((pre) => {
      return Math.min(Math.max(160 / 4, pre * zoom), 160 * 4);
    });
  }, [zoom])

  useEffect(() => {
    const cur = keyframes_area_ref.current as HTMLElement;
    const cell_width = Math.ceil(cur.clientWidth / getcolumnwidth());
    setMaxCell(cell_width);
  }, [scale_width])

  useEffect(() => {

    let map = new Map<number, number>();
    const items = keyframes_area_ref.current?.querySelectorAll('.keyframes_values_cell') as unknown as HTMLElement[];
    items?.forEach((_, idx: number) => {
      map.set(ceil(idx * 100 / zoom, 1), getcolumnwidth() * (idx + 1) + 1);
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
      const capLabel = ceil(label / zoom, 1);
      const item = <KeyframesValueCell key={i} showLabel={isLabel} label={`${capLabel}S`} left={getcolumnwidth() * (i + 1)} />
      cells.push(item);
      if (isLabel) label++;
    }
    return cells;
  }

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const clientX = e.clientX;
    const scrollLeft = document.querySelector('.keyframes_area_box')?.scrollLeft;
    const ceil = Math.ceil(scrollLeft as number);
    setClientX(clientX + ceil);
  }


  return (

    <div className='keyframes_values' ref={keyframes_area_ref} onClick={onClick}>

      {gridColumnRender()}

    </div>
  );
}

