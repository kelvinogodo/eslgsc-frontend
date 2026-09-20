import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AnimatePresence, motion } from 'framer-motion';
import { PhotoIcon, ArrowUpTrayIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { uploadImage, MAX_IMAGE_MB } from '../../../../lib/cloudinary';

/** Drag-and-drop cover picture with a live progress bar and one-click replace/remove. */
const CoverImage = ({ value, onChange, disabled }) => {
  const [progress, setProgress] = useState(null); // null = idle, 0-100 = uploading

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected?.length) {
      toast.error(`Please choose a JPG, PNG or WebP picture under ${MAX_IMAGE_MB} MB.`);
      return;
    }
    const file = accepted?.[0];
    if (!file) return;
    setProgress(0);
    try {
      const url = await uploadImage(file, setProgress);
      onChange(url);
      toast.success('Cover picture added');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProgress(null);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    maxSize: MAX_IMAGE_MB * 1024 * 1024,
    noClick: Boolean(value),
    noKeyboard: true,
    disabled: disabled || progress !== null
  });

  const uploading = progress !== null;

  return (
    <div>
      <div
        {...getRootProps()}
        className={clsx(
          'group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all',
          value ? 'border-transparent' : isDragActive ? 'border-brand-500 bg-brand-50' : 'border-ink-200 bg-ink-50/50 hover:border-brand-300 hover:bg-brand-50/50',
          !value && !disabled && 'cursor-pointer'
        )}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait" initial={false}>
          {value ? (
            <motion.div key="img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              <img src={value} alt="Cover" className="aspect-[16/9] w-full object-cover" />
              {!disabled && (
                <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                  <button type="button" onClick={open} className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-sm font-bold text-ink-800 shadow hover:bg-white">
                    <ArrowPathIcon className="h-4 w-4" /> Change
                  </button>
                  <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-1.5 rounded-xl bg-red-600/95 px-3 py-2 text-sm font-bold text-white shadow hover:bg-red-600">
                    <TrashIcon className="h-4 w-4" /> Remove
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex aspect-[16/9] flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm ring-1 ring-ink-100 transition-transform group-hover:scale-110">
                {isDragActive ? <ArrowUpTrayIcon className="h-6 w-6" /> : <PhotoIcon className="h-6 w-6" />}
              </span>
              <p className="text-sm font-bold text-ink-800">{isDragActive ? 'Drop it here' : 'Add a cover picture'}</p>
              <p className="text-xs text-ink-400">Drag a picture here, or click to choose one</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {uploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-sm">
              <p className="text-sm font-bold text-ink-800">Uploading… {progress}%</p>
              <div className="h-2 w-2/3 overflow-hidden rounded-full bg-ink-100">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" animate={{ width: `${progress}%` }} transition={{ ease: 'easeOut', duration: 0.2 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-1.5 text-xs text-ink-400">Best size: wide (16:9), up to {MAX_IMAGE_MB} MB. JPG, PNG or WebP.</p>
    </div>
  );
};

export default CoverImage;
