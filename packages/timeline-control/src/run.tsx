import './style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AnimationTimelineBox } from './index';

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<AnimationTimelineBox rows={
  [
    {
      keyframesInfo: [
        {
          value: 100,
        },
        {
          value: 200
        }
      ]
    },
    {
      keyframesInfo: [
        {
          value: 100,
        },
        {
          value: 400
        }
      ]
    }
  ]
} />);