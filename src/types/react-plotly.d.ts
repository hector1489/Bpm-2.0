declare module 'react-plotly.js' {
  import { Component } from 'react';
  import { Layout, Data, Config } from 'plotly.js';

  interface PlotParams {
    data: Data[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
    frames?: any;
    revision?: number;
    onInitialized?: (figure: { data: Data[]; layout: Partial<Layout> }) => void;
    onUpdate?: (figure: { data: Data[]; layout: Partial<Layout> }) => void;
    onPurge?: () => void;
    onError?: (err: any) => void;
  }

  export default class Plot extends Component<PlotParams> { }
}
