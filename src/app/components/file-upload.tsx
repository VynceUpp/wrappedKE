import { Upload, FileText, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUseMockData: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function FileUpload({ onFileSelect, onUseMockData }: FileUploadProps) {
  const reduce = useReducedMotion();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Brand words rise out of a mask, same reveal as the welcome slide
  const rise = (delay: number) => ({
    initial: reduce ? (false as const) : { y: '110%' },
    animate: { y: 0 },
    transition: { delay, duration: 0.7, ease: EASE },
  });

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const validTypes = ['text/csv', 'application/pdf'];
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

    if (validTypes.includes(file.type) || ['.csv', '.pdf'].includes(extension)) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      toast.error('Please upload a valid CSV or PDF file.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files?.[0] ?? null);
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
    handleFileChange(e.target.files?.[0] ?? null);
    // Reset so picking the same file again (e.g. after a wrong password) still fires onChange
    e.target.value = '';
  };

  return (
    // Transparent on purpose: App draws the green gradient + floating shapes behind this
    <div className="flex min-h-[100dvh] items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
      <motion.div
        className="w-full max-w-xl"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <Card className="space-y-7 border-green-100 bg-white/85 p-6 shadow-xl shadow-green-900/5 backdrop-blur-md sm:p-10">
          <div className="space-y-3 text-center">
            <h1 className="flex justify-center text-[clamp(2.5rem,13vw,3.75rem)] font-extrabold leading-none tracking-tight">
              <span className="block overflow-hidden pb-2">
                <motion.span className="block text-green-700" {...rise(0.15)}>
                  wrapped
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span className="block text-emerald-600" {...rise(0.3)}>
                  KE
                </motion.span>
              </span>
            </h1>
            <p className="text-base text-gray-600 sm:text-lg">
              Turn your M-Pesa statement into your year in review
            </p>
          </div>

          <div className="space-y-5">
            {/* Upload area */}
            <motion.div
              animate={{ scale: isDragging ? 1.02 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 sm:p-8 ${
                isDragging
                  ? 'border-green-500 bg-green-50'
                  : 'border-green-300 hover:border-green-500'
              } ${selectedFile ? 'bg-green-50' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <label htmlFor="file-upload" className="block cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={reduce || selectedFile ? undefined : { y: [0, -6, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Upload className="h-12 w-12 text-green-600" />
                  </motion.div>

                  {!selectedFile ? (
                    <>
                      <div>
                        <p className="mb-1 text-lg">
                          {isDragging ? 'Drop your file here' : 'Add your M-Pesa statement'}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="hidden sm:inline">
                            Drag and drop, or click to browse (CSV or PDF)
                          </span>
                          <span className="sm:hidden">Tap to choose a CSV or PDF</span>
                        </p>
                      </div>
                      <Button
                        type="button"
                        tabIndex={-1}
                        className="h-12 bg-green-600 px-8 text-base hover:bg-green-700"
                      >
                        Choose file
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-3 text-green-700">
                        <FileText className="h-8 w-8 shrink-0" />
                        <span className="max-w-[12rem] truncate text-lg font-medium sm:max-w-xs">
                          {selectedFile.name}
                        </span>
                        <button
                          type="button"
                          aria-label="Remove file"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="rounded-full p-2 transition hover:bg-green-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-sm text-green-600">Statement selected. Tap to pick a different one.</p>
                    </div>
                  )}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,text/csv,application/pdf,.pdf"
                  className="sr-only"
                  onChange={handleInputChange}
                />
              </label>
            </motion.div>

            {!selectedFile && (
              <>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="h-px flex-1 bg-green-200" />
                  or
                  <span className="h-px flex-1 bg-green-200" />
                </div>
                <Button
                  onClick={onUseMockData}
                  variant="outline"
                  className="h-12 w-full border-green-300 text-base text-green-700 hover:bg-green-50"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Try it with demo data
                </Button>
              </>
            )}

            <p className="text-center text-xs text-gray-500">
              Tip: the CSV from the M-PESA app is the fastest and most accurate. PDFs need their password.
            </p>
          </div>

          <div className="space-y-1 border-t border-green-100 pt-5 text-center text-sm text-gray-500">
            <p>🔒 Everything is processed on your device. Nothing is uploaded.</p>
            <p className="text-xs">
              Open source on{' '}
              <a
                href="https://github.com/VynceUpp/wrappedKE"
                target="_blank"
                rel="noreferrer"
                className="text-green-700 underline underline-offset-2"
              >
                GitHub
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
