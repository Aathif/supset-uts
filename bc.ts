import React from 'react';
import Echart from '../components/Echart';
import { jsx as ___EmotionJSX } from "@emotion/react";
export default function EchartsMixedTimeseries({
  height,
  width,
  echartOptions
}) {
  return ___EmotionJSX(Echart, {
    height: height,
    width: width,
    echartOptions: echartOptions
  });
}
