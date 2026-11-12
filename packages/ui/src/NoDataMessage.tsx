import type { ReactNode } from "react";

export interface NoDataMessageProps {
  message: ReactNode;
  action?: ReactNode;
}

export const NoDataMessage = ({ message, action }: NoDataMessageProps) => (
  <div role="status" className="no-data">
    <p className="no-data__message">{message}</p>
    {action ? <div className="no-data__action">{action}</div> : null}
  </div>
);
