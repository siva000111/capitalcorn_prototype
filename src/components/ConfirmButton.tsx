import { useState } from 'react';

interface ConfirmButtonProps {
  label: string;
  confirmLabel?: string;
  className?: string;
  onConfirm: () => void;
}

export default function ConfirmButton({
  label,
  confirmLabel = 'Confirm?',
  className = 'btn btn-sm btn-danger',
  onConfirm,
}: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="confirm-group">
        <button
          type="button"
          className={className}
          onClick={() => {
            setConfirming(false);
            onConfirm();
          }}
        >
          {confirmLabel}
        </button>
        <button type="button" className="btn btn-sm" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button type="button" className={className} onClick={() => setConfirming(true)}>
      {label}
    </button>
  );
}
