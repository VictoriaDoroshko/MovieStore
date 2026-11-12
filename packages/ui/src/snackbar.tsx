"use client";

import { useEffect, type ReactNode } from "react";

export type SnackbarStatus = "success" | "error" | "info";

export interface SnackbarProps {
  message: ReactNode;
  status?: SnackbarStatus;
  onClose: () => void;
  action?: ReactNode;
}

const AUTO_DISMISS_MS = 3000;

export const Snackbar = ({
  message,
  status = "success",
  onClose,
  action,
}: SnackbarProps) => {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <div
      role={status === "error" ? "alert" : "status"}
      aria-live={status === "error" ? "assertive" : "polite"}
      className={`snackbar snackbar--${status}`}
    >
      <span className="snackbar__message">{message}</span>
      {action ? <span className="snackbar__action">{action}</span> : null}
    </div>
  );
};
