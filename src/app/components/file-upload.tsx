import { Upload, FileText, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUseMockData: () => void;
}

export function FileUpload({ onFileSelect, onUseMockData }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const validTypes = ['text/csv', 'application/pdf'];
    const validExtensions = ['.csv', '.pdf'];

    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (validTypes.includes(file.type) || validExtensions.includes(extension)) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert('Please upload a valid CSV or PDF file.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFileChange(file || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl text-green-700">
            Finance<span className="text-emerald-600">Wrapped</span>
          </h1>
          <p className="text-lg text-gray-600">
            Transform your M-Pesa statement into a beautiful financial story
          </p>
        </div>

        <div className="space-y-6">
          {/* Drag & Drop / Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              isDragging
                ? 'border-green-500 bg-green-50'
                : 'border-green-300 hover:border-green-500'
            } ${selectedFile ? 'bg-green-50' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-12 w-12 text-green-600" />
                {!selectedFile ? (
                  <>
                    <div>
                      <p className="text-lg mb-2">
                        {isDragging ? 'Drop your file here' : 'Upload your M-Pesa statement'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Drag & drop or click to browse (CSV or PDF)
                      </p>
                    </div>
                    <Button
                      type="button"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Choose File
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 text-green-700">
                      <FileText className="h-8 w-8" />
                      <span className="text-lg font-medium">{selectedFile.name}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearFile();
                        }}
                        className="p-1 hover:bg-green-200 rounded-full transition"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-green-600">File ready for analysis!</p>
                  </div>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".csv,text/csv,application/pdf,.pdf"
                className="hidden"
                onChange={handleInputChange}
              />
            </label>
          </div>

          {/* Divider and Demo Button */}
          {!selectedFile && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              <Button
                onClick={onUseMockData}
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-50"
              >
                <FileText className="mr-2 h-5 w-5" />
                Use Demo Data
              </Button>
            </>
          )}
        </div>

        <div className="text-center text-sm text-gray-500 space-y-2">
          <p>🔒 Your data is processed locally and never leaves your device</p>
          <p className="text-xs">Privacy-focused • No data collection • Open source</p>
        </div>
      </Card>
    </div>
  );
}