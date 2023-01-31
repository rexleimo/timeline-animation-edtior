import React from 'react';
import './style.less';
import { KeyframesValueCellParams } from './types/KeyframesValueCellParams';



export function KeyframesValueCell(props: KeyframesValueCellParams) {

  const { showLabel = true, label } = props;

  return (
    <div className='keyframes_values_cell' style={{
      height: showLabel ? 12 : 8
    }}>
      <span className='tip'>
        {showLabel && label}
      </span>
    </div>
  )
}