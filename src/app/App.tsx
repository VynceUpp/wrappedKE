import { useState } from 'react';
import { FileUpload } from './components/file-upload';
import { StorySlides } from './components/story-slides';
import { AnalyticsDashboard } from './components/analytics-dashboard';
import { parseMpesaCSV, generateMockData, FinancialSummary, parseMpesaPDF } from './utils/data-processor';
import { toast, Toaster } from 'sonner';

type View = 'upload' | 'stories' | 'dashboard';

export default function App() {
  const [view, setView] = useState<View>('upload');
  const [data, setData] = useState<FinancialSummary | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      let summary: FinancialSummary;

      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        const text = await file.text();
        summary = await parseMpesaCSV(text);
      } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const userPassword = prompt(
          "M-Pesa statements are password-protected.\n\n" +
          "Enter the password to open this file:\n\n" +
          "• Your National ID number (e.g., 12345678 — no spaces or dashes)\n" +
          "• OR the 6-digit code Safaricom sent you via SMS when you requested this statement"
        );

        if (!userPassword) {
          toast.error("Password is required to open the statement.");
          return;
        }

        summary = await parseMpesaPDF(file, userPassword.trim());
      } else {
        toast.error("Unsupported file type. Please upload a CSV or PDF.");
        return;
      }

      // Success! Store data and move to stories view
      setData(summary);
      setView('stories');
      toast.success('Statement processed successfully! 🎉');
    } catch (err: any) {
      console.error(err);

      if (err.name === "PasswordException") {
        toast.error("Incorrect password. Please try again with either your National ID number or the 6-digit SMS code.");
      } else if (err.message?.includes("No transactions found")) {
        toast.error("No transactions detected. Make sure this is a valid M-Pesa statement.");
      } else {
        toast.error("Failed to parse file. Please check the format and try again.");
      }
    }
  };

  const handleUseMockData = () => {
    const mockData = generateMockData();
    setData(mockData);
    setView('stories');
    toast.success('Demo data loaded!');
  };

  const handleViewDashboard = () => {
    setView('dashboard');
  };

  const handleBackToUpload = () => {
    setView('upload');
    setData(null);
  };

  const handleBackToStories = () => {
    setView('stories');
  };

  return (
    <>
      <Toaster position="top-center" />

      {view === 'upload' && (
        <FileUpload
          onFileSelect={handleFileSelect}
          onUseMockData={handleUseMockData}
        />
      )}

      {view === 'stories' && data && (
        <StorySlides
          data={data}
          onClose={handleBackToUpload}
          onViewDashboard={handleViewDashboard}
        />
      )}

      {view === 'dashboard' && data && (
        <AnalyticsDashboard
          data={data}
          onBack={handleBackToStories}
        />
      )}
    </>
  );
}