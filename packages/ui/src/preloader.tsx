export interface PreLoaderProps {
  label?: string;
}

export const PreLoader = ({ label = "Loading…" }: PreLoaderProps) => (
  <div
    role="status"
    aria-live="polite"
    aria-label={label}
    className="preloader"
  >
    <span className="preloader__spinner" aria-hidden="true" />
    <span className="preloader__srOnly">{label}</span>
  </div>
);
