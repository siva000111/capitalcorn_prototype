interface EmptyStateProps {
  message: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {action && (
        <button type="button" className="btn btn-sm" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
