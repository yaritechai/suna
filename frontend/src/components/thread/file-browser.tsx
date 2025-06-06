'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  File,
  Folder,
  ChevronRight,
  ChevronUp,
  FileText,
  Coffee,
} from 'lucide-react';
import {
  listSandboxFiles,
  getSandboxFileContent,
  type FileInfo,
} from '@/lib/api';
import { toast } from 'sonner';

interface FileBrowserProps {
  sandboxId: string;
  onSelectFile?: (path: string, content: string) => void;
  trigger?: React.ReactNode;
}

export function FileBrowser({
  sandboxId,
  onSelectFile,
  trigger,
}: FileBrowserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadFiles('');
    } else {
      setFileContent(null);
      setSelectedFile(null);
    }
  }, [isOpen, sandboxId]);

  // Load files from the current path
  const loadFiles = async (path: string) => {
    setIsLoading(true);
    try {
      const files = await listSandboxFiles(sandboxId, path);
      setFiles(files);
      setCurrentPath(path);

      // Update breadcrumbs
      if (path === '') {
        setBreadcrumbs([]);
      } else {
        const parts = path.split('/').filter(Boolean);
        setBreadcrumbs(parts);
      }
    } catch (error) {
      toast.error('Failed to load files');
      console.error('Failed to load files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load file content
  const loadFileContent = async (path: string) => {
    setIsLoading(true);
    setSelectedFile(path);
    try {
      const content = await getSandboxFileContent(sandboxId, path);
      if (typeof content === 'string') {
        setFileContent(content);
      } else {
        // For binary files, show a message
        setFileContent('[Binary file]');
      }
    } catch (error) {
      toast.error('Failed to load file content');
      console.error('Failed to load file content:', error);
      setFileContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file or folder click
  const handleItemClick = (file: FileInfo) => {
    if (file.is_dir) {
      loadFiles(file.path);
    } else {
      loadFileContent(file.path);
    }
  };

  // Navigate to a specific breadcrumb
  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      // Root directory
      loadFiles('');
    } else {
      const path = breadcrumbs.slice(0, index + 1).join('/');
      loadFiles(path);
    }
  };

  // Handle select button click
  const handleSelectFile = () => {
    if (selectedFile && fileContent && onSelectFile) {
      onSelectFile(selectedFile, fileContent);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Browse Files</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col !bg-base-100 border-2 border-base-300 shadow-xl">
        <DialogHeader className="bg-base-200 px-6 py-4 border-b-2 border-base-300 rounded-t-lg">
          <DialogTitle className="text-xl font-bold text-base-content">Sandbox Files</DialogTitle>
        </DialogHeader>

        {/* Breadcrumbs */}
        <div className="flex items-center space-x-1 text-sm py-3 px-6 border-b-2 border-base-300 bg-base-100">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 bg-base-200 hover:bg-primary hover:text-primary-content rounded-lg font-medium"
            onClick={() => navigateToBreadcrumb(-1)}
          >
            <Folder className="h-4 w-4 mr-1" />
            root
          </Button>
          {breadcrumbs.map((part, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-base-content" />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 bg-base-200 hover:bg-primary hover:text-primary-content rounded-lg font-medium"
                onClick={() => navigateToBreadcrumb(index)}
              >
                {part}
              </Button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden p-6 bg-base-100">
          {/* File list */}
          <div className="border-2 border-base-300 rounded-2xl overflow-y-auto h-[400px] bg-base-50">
            {isLoading && !files.length ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-base-content">
                <div className="bg-base-100 rounded-2xl p-8 border-2 border-base-300 shadow-lg">
                  <Coffee className="h-12 w-12 mb-4 text-base-content mx-auto" />
                  <p className="font-semibold">No files found</p>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {currentPath !== '' && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm mb-2 h-10 bg-base-100 hover:bg-primary hover:text-primary-content rounded-xl font-medium"
                    onClick={() => {
                      const parentPath = currentPath
                        .split('/')
                        .slice(0, -1)
                        .join('/');
                      loadFiles(parentPath);
                    }}
                  >
                    <ChevronUp className="h-4 w-4 mr-2" />
                    ..
                  </Button>
                )}
                {files.map((file) => (
                  <Button
                    key={file.path}
                    variant={selectedFile === file.path ? 'secondary' : 'ghost'}
                    className={`w-full justify-start text-sm mb-2 h-10 rounded-xl font-medium ${
                      selectedFile === file.path
                        ? 'bg-primary/30 border-2 border-primary text-primary'
                        : 'bg-base-100 hover:bg-primary hover:text-primary-content'
                    }`}
                    onClick={() => handleItemClick(file)}
                  >
                    {file.is_dir ? (
                      <Folder className="h-4 w-4 mr-2 text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2 text-base-content" />
                    )}
                    {file.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* File preview */}
          <div className="border-2 border-base-300 rounded-2xl overflow-hidden flex flex-col bg-base-50">
            <div className="p-4 bg-base-200 text-sm font-bold border-b-2 border-base-300 text-base-content">
              {selectedFile ? selectedFile.split('/').pop() : 'File Preview'}
            </div>
            <div className="p-4 overflow-y-auto flex-1 h-[360px] bg-base-100">
              {isLoading && selectedFile ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
                              ) : fileContent ? (
                <pre className="text-sm whitespace-pre-wrap text-base-content font-mono bg-base-200 p-4 rounded-xl border-2 border-base-300">{fileContent}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-base-content">
                  <div className="bg-base-200 rounded-2xl p-8 border-2 border-base-300 shadow-lg text-center">
                    <File className="h-12 w-12 mb-4 text-base-content mx-auto" />
                    <p className="font-semibold">Select a file to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedFile && fileContent && onSelectFile && (
          <div className="flex justify-end pt-4 px-6 pb-6">
            <Button 
              onClick={handleSelectFile}
              className="bg-primary hover:bg-primary/90 text-primary-content font-semibold px-6 py-2 rounded-xl"
            >
              Select File
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
