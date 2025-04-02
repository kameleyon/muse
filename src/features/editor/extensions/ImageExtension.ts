import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ImageNode from './ImageNode';

export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      insertImage: (src: string, alt?: string) => ReturnType;
    };
  }
}

export const Image = Node.create<ImageOptions>({
  name: 'image',
  
  group: 'block',
  
  content: '',
  
  marks: '',
  
  atom: true,
  
  draggable: true,

  isolating: true,

  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML: element => element.getAttribute('src'),
        renderHTML: attributes => {
          return {
            src: attributes.src,
          };
        },
      },
      alt: {
        default: '',
        parseHTML: element => element.getAttribute('alt'),
        renderHTML: attributes => {
          return {
            alt: attributes.alt,
          };
        },
      },
      width: {
        default: 'auto',
        parseHTML: element => element.getAttribute('width'),
        renderHTML: attributes => {
          return {
            width: attributes.width,
          };
        },
      },
      height: {
        default: 'auto',
        parseHTML: element => element.getAttribute('height'),
        renderHTML: attributes => {
          return {
            height: attributes.height,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNode);
  },

  addCommands() {
    return {
      insertImage:
        (src, alt = '') =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              src,
              alt,
            },
          });
        },
    };
  },
});

export default Image;
