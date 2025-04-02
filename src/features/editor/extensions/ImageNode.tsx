import React, { useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';

const ImageNode: React.FC<NodeViewProps> = ({ node, updateAttributes, editor }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(node.attrs.width || 'auto');
  const [height, setHeight] = useState(node.attrs.height || 'auto');

  const handleResize = (newWidth: string, newHeight: string) => {
    setWidth(newWidth);
    setHeight(newHeight);
    updateAttributes({
      width: newWidth,
      height: newHeight,
    });
  };

  const handleImageClick = () => {
    // You could implement an image editor here
    console.log('Image clicked');
  };

  return (
    <NodeViewWrapper className="image-node-wrapper">
      <div className="image-container" style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          width={width}
          height={height}
          style={{ 
            maxWidth: '100%',
            cursor: 'pointer',
            border: editor.isEditable ? '1px dashed #ccc' : 'none',
            padding: '2px'
          }}
          onClick={handleImageClick}
        />
        
        {editor.isEditable && (
          <div className="image-controls" style={{ 
            position: 'absolute', 
            bottom: '5px', 
            right: '5px',
            background: 'rgba(255,255,255,0.8)',
            padding: '2px 5px',
            borderRadius: '3px',
            fontSize: '12px',
            display: 'flex',
            gap: '5px'
          }}>
            <button 
              onClick={() => handleResize('100%', 'auto')}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                color: '#333',
                padding: '2px 5px',
                fontSize: '10px'
              }}
            >
              100%
            </button>
            <button 
              onClick={() => handleResize('75%', 'auto')}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                color: '#333',
                padding: '2px 5px',
                fontSize: '10px'
              }}
            >
              75%
            </button>
            <button 
              onClick={() => handleResize('50%', 'auto')}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                color: '#333',
                padding: '2px 5px',
                fontSize: '10px'
              }}
            >
              50%
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ImageNode;
