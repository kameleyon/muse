import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ChartNode from './ChartNode';

export interface ChartOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    chart: {
      /**
       * Add a chart
       */
      insertChart: (chartData: string, chartType?: string) => ReturnType;
    };
  }
}

export const Chart = Node.create<ChartOptions>({
  name: 'chart',
  
  group: 'block',
  
  content: '',
  
  marks: '',
  
  atom: true,
  
  draggable: true,

  isolating: true,

  addAttributes() {
    return {
      chartData: {
        default: '[]',
        parseHTML: element => element.getAttribute('data-chart-data'),
        renderHTML: attributes => {
          return {
            'data-chart-data': attributes.chartData,
          };
        },
      },
      chartType: {
        default: 'bar',
        parseHTML: element => element.getAttribute('data-chart-type'),
        renderHTML: attributes => {
          return {
            'data-chart-type': attributes.chartType,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-chart]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-chart': '' }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartNode);
  },

  addCommands() {
    return {
      insertChart:
        (chartData, chartType = 'bar') =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              chartData,
              chartType,
            },
          });
        },
    };
  },
});

export default Chart;
