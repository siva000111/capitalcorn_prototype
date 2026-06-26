export interface ToastMessage {
  id: number;
  message: string;
}

type Listener = (toasts: ToastMessage[]) => void;

let toasts: ToastMessage[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

export function showToast(message: string, durationMs = 3000) {
  const id = nextId++;
  toasts = [...toasts, { id, message }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, durationMs);
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  listener(toasts);
  return () => listeners.delete(listener);
}
