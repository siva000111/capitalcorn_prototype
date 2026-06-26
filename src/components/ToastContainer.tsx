import { useEffect, useState } from 'react';
import { subscribeToasts, type ToastMessage } from '../toast';

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => subscribeToasts(setToasts), []);

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
