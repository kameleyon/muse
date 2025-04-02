import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/Button';
import { FaImage, FaTimes, FaUpload, FaLink } from 'react-icons/fa';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, editor }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen || !editor) return null;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImage = () => {
    if (activeTab === 'url' && imageUrl) {
      editor.chain().focus().insertImage(imageUrl).run();
      onClose();
    } else if (activeTab === 'upload' && previewUrl) {
      editor.chain().focus().insertImage(previewUrl).run();
      onClose();
    }
  };

  // Sample images for quick selection
  const sampleImages = [
    '/mmlogo.png',
    '/mmiologo.png',
    '/magicmuse-icon.svg',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Insert Image</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4">
          <div className="flex mb-4 border-b">
            <button
              className={`px-4 py-2 ${activeTab === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('upload')}
            >
              <FaUpload className="inline mr-2" /> Upload
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'url' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
              onClick={() => setActiveTab('url')}
            >
              <FaLink className="inline mr-2" /> URL
            </button>
          </div>

          {activeTab === 'upload' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              {previewUrl && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Preview</p>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-40 max-w-full object-contain border border-gray-200 rounded"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Quick Select</p>
                <div className="grid grid-cols-3 gap-2">
                  {sampleImages.map((img, index) => (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded p-1 cursor-pointer hover:border-primary"
                      onClick={() => {
                        setPreviewUrl(img);
                        setImageFile(null);
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`Sample ${index + 1}`} 
                        className="h-16 w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full p-2 border border-gray-300 rounded"
              />
              
              {imageUrl && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Preview</p>
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="max-h-40 max-w-full object-contain border border-gray-200 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      alert('Failed to load image from URL');
                    }}
                    onLoad={(e) => {
                      (e.target as HTMLImageElement).style.display = 'block';
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleInsertImage}
              disabled={(activeTab === 'url' && !imageUrl) || (activeTab === 'upload' && !previewUrl)}
            >
              Insert Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
