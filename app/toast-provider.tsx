'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />;
}
