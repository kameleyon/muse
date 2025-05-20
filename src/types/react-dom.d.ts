declare module 'react-dom/server' {
  import * as React from 'react';
  
  export function renderToString(element: React.ReactElement): string;
  export function renderToStaticMarkup(element: React.ReactElement): string;
  export function renderToNodeStream(element: React.ReactElement): any;
  export function renderToStaticNodeStream(element: React.ReactElement): any;
}

declare module 'react-dom/client' {
  import * as React from 'react';
  
  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
  
  export function createRoot(container: Element | DocumentFragment): Root;
  export function hydrateRoot(container: Element, initialChildren: React.ReactNode): Root;
}
