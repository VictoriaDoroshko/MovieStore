import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

export interface InputFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: ReactNode;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, id, className, type = "text", ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    const wrapperClasses = ["input-field", error && "input-field--error"]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        <label htmlFor={inputId} className="input-field__label">
          {label}
        </label>
        <input
          {...rest}
          ref={ref}
          id={inputId}
          type={type}
          className={["input-field__input", className]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
        />
        {error ? (
          <p id={errorId} role="alert" className="input-field__error">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

InputField.displayName = "InputField";
