import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addToast } from '@/store/slices/uiSlice';
import ContentExporter from '@/services/export';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Form, FormGroup, FormLabel } from '@/components/ui/Form';

interface ContentExportProps {
  content: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ContentExport: React.FC<ContentExportProps> = ({
  content,
  title = 'Untitled Document',
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [isExporting, setIsExporting] = useState(false);
  const [exportTitle, setExportTitle] = useState(title);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'html' | 'text'>('pdf');
  const [includeMetadata, setIncludeMetadata] = useState(true);

  // Handle export
  const handleExport = async () => {
    try {
      setIsExporting(true);

      const options = {
        filename: `${exportTitle || 'document'}.${exportFormat}`,
        title: exportTitle,
        author: 'MagicMuse User',
        dateCreated: new Date(),
        includeMetadata,
      };

      switch (exportFormat) {
        case 'pdf':
          await ContentExporter.exportToPdf(content, options);
          break;
        case 'docx':
          await ContentExporter.exportToDocx(content, options);
          break;
        case 'html':
          await ContentExporter.exportToHtml(content, options);
          break;
        case 'text':
          ContentExporter.exportToText(content, options);
          break;
      }

      dispatch(
        addToast({
          type: 'success',
          message: `Content exported as ${exportFormat.toUpperCase()} successfully`,
        })
      );

      onClose();
    } catch (error: any) {
      dispatch(
        addToast({
          type: 'error',
          message: error.message || `Failed to export as ${exportFormat.toUpperCase()}`,
        })
      );
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-neutral-dark rounded-lg shadow-xl w-full max-w-md"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold font-heading mb-4">Export Content</h2>

            <Form onSubmit={(e) => { e.preventDefault(); handleExport(); }}>
              <FormGroup>
                <FormLabel htmlFor="exportTitle" required>
                  Document Title
                </FormLabel>
                <Input
                  id="exportTitle"
                  type="text"
                  value={exportTitle}
                  onChange={(e) => setExportTitle(e.target.value)}
                  placeholder="Enter document title"
                  disabled={isExporting}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Export Format</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {(['pdf', 'docx', 'html', 'text'] as const).map((format) => (
                    <Button
                      key={format}
                      type="button"
                      variant={exportFormat === format ? 'primary' : 'outline'}
                      onClick={() => setExportFormat(format)}
                      disabled={isExporting}
                      className="justify-center"
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </FormGroup>

              <FormGroup>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeMetadata"
                    checked={includeMetadata}
                    onChange={(e) => setIncludeMetadata(e.target.checked)}
                    className="mr-2 rounded border-neutral-light text-accent-teal focus:ring-accent-teal"
                    disabled={isExporting}
                  />
                  <label
                    htmlFor="includeMetadata"
                    className="text-sm text-neutral-medium"
                  >
                    Include title and metadata in exported document
                  </label>
                </div>
              </FormGroup>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isExporting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isExporting}
                  disabled={isExporting}
                >
                  Export
                </Button>
              </div>
            </Form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ContentExport;
