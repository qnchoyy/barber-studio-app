import { forwardRef } from "react";

const InputField = forwardRef(
  (
    {
      icon: Icon,
      error,
      label,
      className = "",
      containerClassName = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          )}
          <input
            ref={ref}
            className={`w-full ${
              Icon ? "pl-10" : "pl-3"
            } pr-3 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              error ? "border-2 border-red-500" : "border border-gray-600"
            } ${
              props.disabled ? "opacity-75 cursor-not-allowed" : ""
            } ${className}`}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-400 flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
