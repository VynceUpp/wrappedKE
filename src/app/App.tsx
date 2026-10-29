import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FileUpload } from './components/file-upload';
import { StorySlides } from './components/story-slides';
import { AnalyticsDashboard } from './components/analytics-dashboard';
import { parseMpesaCSV, generateMockData, FinancialSummary, parseMpesaPDF } from './utils/data-processor';
import { toast, Toaster } from 'sonner';

type View = 'upload' | 'stories' | 'dashboard';

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const FLOATERS = ['💸', '📱', '🛍️', '💡', '🍽️', '🚗', '💰', '📊'];

/* ---------- Ambient background: glowing blobs + drifting emoji ---------- */
function Ambient({ showEmoji }: { showEmoji: boolean }) {
  const reduce = useReducedMotion();

  // Randomised once per visit, not on every render
  const floaters = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        emoji: FLOATERS[i % FLOATERS.length],
        left: rand(4, 92),
        size: rand(22, 38),
        duration: rand(14, 26),
        delay: rand(0, 12),
        drift: rand(-40, 40),
      })),
    []
  );

  const blobs = [
    { cls: 'bg-green-500/20 -left-24 top-[-6rem] h-80 w-80', dx: 40, dy: 30, d: 18 },
    { cls: 'bg-emerald-400/15 -right-24 top-1/3 h-72 w-72', dx: -30, dy: 40, d: 22 },
    { cls: 'bg-teal-400/10 left-1/4 bottom-[-8rem] h-80 w-80', dx: 30, dy: -30, d: 26 },
  ];

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${
        showEmoji ? 'bg-gradient-to-br from-green-50 to-emerald-100' : ''
      }`}
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${b.cls}`}
          animate={reduce ? undefined : { x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Emoji only on the upload screen so slides and charts stay clean */}
      {showEmoji &&
        !reduce &&
        floaters.map((f, i) => (
          <motion.span
            key={i}
            className="absolute top-0 select-none"
            style={{ left: `${f.left}%`, fontSize: f.size }}
            initial={{ opacity: 0, y: '105vh' }}
            animate={{ y: '-15vh', x: [0, f.drift, 0], opacity: [0, 0.35, 0.35, 0] }}
            transition={{
              y: { duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'linear' },
              x: { duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'easeInOut' },
              opacity: {
                duration: f.duration,
                delay: f.delay,
                repeat: Infinity,
                ease: 'linear',
                times: [0, 0.1, 0.9, 1],
              },
            }}
          >
            {f.emoji}
          </motion.span>
        ))}
    </div>
  );
}

/* ---------- Bottom sheet that replaces window.prompt() ---------- */
function PasswordDialog({
  open,
  busy,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  busy: boolean;
  onSubmit: (password: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setValue('');
      setShow(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !busy && onCancel()}
        >
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="pw-title"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (value.trim()) onSubmit(value.trim());
            }}
            className="w-full max-w-md rounded-t-3xl border border-green-100 bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-gray-900 shadow-2xl sm:rounded-3xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <h2 id="pw-title" className="text-xl font-semibold text-green-700">
              Unlock your statement
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your National ID number (no spaces or dashes), or the 6-digit code Safaricom
              sent you by SMS when you requested this statement.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 focus-within:border-green-500">
              <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type={show ? 'text' : 'password'}
                inputMode="numeric"
                autoComplete="off"
                placeholder="Password"
                aria-label="Statement password"
                className="h-12 flex-1 bg-transparent text-lg text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="text-sm text-green-700"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={busy}
                className="h-12 flex-1 rounded-xl border border-green-200 text-green-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy || !value.trim()}
                className="h-12 flex-1 rounded-xl bg-green-600 font-semibold text-white disabled:opacity-50"
              >
                {busy ? 'Opening…' : 'Unlock'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [view, setView] = useState<View>('upload');
  const [data, setData] = useState<FinancialSummary | null>(null);
  const [pendingPdf, setPendingPdf] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'wrappedKE';
  }, []);

  const finish = (summary: FinancialSummary) => {
    setData(summary);
    setView('stories');
    toast.success('Statement processed successfully! 🎉');
  };

  const handleError = (err: any) => {
    console.error(err);
    if (err?.name === 'PasswordException') {
      toast.error('Incorrect password. Try your National ID number or the 6-digit SMS code.');
    } else if (err?.message?.includes('No transactions found')) {
      toast.error('No transactions detected. Make sure this is a valid M-Pesa statement.');
    } else {
      toast.error('Failed to parse file. Please check the format and try again.');
    }
  };

  const handleFileSelect = async (file: File) => {
    const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

    if (isCsv) {
      try {
        finish(await parseMpesaCSV(await file.text()));
      } catch (err) {
        handleError(err);
      }
    } else if (isPdf) {
      setPendingPdf(file); // opens the password sheet
    } else {
      toast.error('Unsupported file type. Please upload a CSV or PDF.');
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!pendingPdf) return;
    setBusy(true);
    try {
      finish(await parseMpesaPDF(pendingPdf, password));
      setPendingPdf(null);
    } catch (err: any) {
      handleError(err);
      // Wrong password: keep the sheet open so they can retry. Anything else: close it.
      if (err?.name !== 'PasswordException') setPendingPdf(null);
    } finally {
      setBusy(false);
    }
  };

  const handleUseMockData = () => {
    setData(generateMockData());
    setView('stories');
    toast.success('Demo data loaded!');
  };

  return (
    <>
      <Toaster
        position="top-center"
        theme="light"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#14532d',
            border: '1px solid #bbf7d0',
            backdropFilter: 'blur(8px)',
          },
        }}
      />

      {/* Sits behind everything. If a view paints its own opaque full-screen
          background, make that background transparent so this shows through. */}
      <Ambient showEmoji={view === 'upload'} />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {/* Opacity only: a transform here would break position:fixed inside the views */}
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {view === 'upload' && (
              <FileUpload onFileSelect={handleFileSelect} onUseMockData={handleUseMockData} />
            )}

            {view === 'stories' && data && (
              <StorySlides
                data={data}
                onClose={() => {
                  setView('upload');
                  setData(null);
                }}
                onViewDashboard={() => setView('dashboard')}
              />
            )}

            {view === 'dashboard' && data && (
              <AnalyticsDashboard data={data} onBack={() => setView('stories')} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <PasswordDialog
        open={pendingPdf !== null}
        busy={busy}
        onSubmit={handlePasswordSubmit}
        onCancel={() => setPendingPdf(null)}
      />
    </>
  );
}
