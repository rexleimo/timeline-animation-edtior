import React from 'react';
import './style.less';
import { KeyframesValueCellParams } from './types/KeyframesValueCellParams';
import classNames from 'classnames';


export function KeyframesValueCell(props: KeyframesValueCellParams) {

  const { showLabel = true, label, left = 0 } = props;

  return (
    <div className={
      classNames('keyframes_values_cell', {
        'show': showLabel
      })
    } style={{
      height: showLabel ? 12 : 8,
      left: left
    }}>
      {showLabel && (
        <span className='tip'>
          {label}S
        </span>
      )}
    </div>

  )
}