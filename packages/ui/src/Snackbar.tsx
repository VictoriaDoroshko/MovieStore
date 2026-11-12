"use client";

import { useEffect, useRef, type ReactNode } from "react";

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
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => onCloseRef.current(),
      AUTO_DISMISS_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, []);

  const isError = status === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? undefined : "polite"}
      className={`snackbar snackbar--${status}`}
    >
      <span className="snackbar__message">{message}</span>
      {action ? <span className="snackbar__action">{action}</span> : null}
    </div>
  );
};
