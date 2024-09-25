 import { t, ChartMetadata, ChartPlugin } from '@superset-ui/core';
 import transformProps from './transformProps';
 import controlPanel from './controlPanel';
 
 const metadata = new ChartMetadata({
   category: t('Part of a Whole'),
   credits: ['https://bl.ocks.org/mbostock/911ad09bdead40ec0061'],
   description: t(
     'Shows the composition of a dataset by segmenting a given rectangle as smaller rectangles with areas proportional to their value or contribution to the whole. Those rectangles may also, in turn, be further segmented hierarchically.',
   ),
  //  exampleGallery: [{ url: example1 }, { url: example2 }, { url: example3 }, { url: example4 }],
   name: t('Treemap'),
   tags: [t('Categorical'), t('Legacy'), t('Multi-Levels'), t('Percentages'), t('Proportional')],
  //  thumbnail,
   useLegacyApi: true,
 });
 
 export default class TreemapChartPlugin extends ChartPlugin {
   constructor() {
     super({
       loadChart: () => import('./ReactTreemap.js'),
       metadata,
       transformProps,
       controlPanel,
     });
   }
 }
 
