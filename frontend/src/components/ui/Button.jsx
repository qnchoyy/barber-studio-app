import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "medium",
      loading = false,
      disabled = false,
      icon: Icon,
      iconPosition = "left",
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:ring-blue-500 disabled:from-blue-400 disabled:to-blue-400",

      secondary:
        "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border border-gray-500 hover:border-gray-400 focus:ring-gray-500 disabled:from-gray-600 disabled:to-gray-600 disabled:border-gray-600",

      success:
        "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500 disabled:from-green-400 disabled:to-green-400",

      danger:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500 disabled:from-red-400 disabled:to-red-400",

      warning:
        "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white focus:ring-yellow-500 disabled:from-yellow-400 disabled:to-yellow-400",

      purple:
        "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white focus:ring-purple-500 disabled:from-purple-400 disabled:to-purple-400",

      outline:
        "border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-500 disabled:border-gray-700 disabled:text-gray-500",

      ghost:
        "text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-500 disabled:text-gray-500",
    };

    const sizeStyles = {
      small: "px-3 py-2 text-sm h-8",
      medium: "px-4 py-2 text-sm h-10",
      large: "px-6 py-3 text-base h-12",
      xl: "px-8 py-4 text-lg h-14",
    };

    const iconSizes = {
      small: "w-3 h-3",
      medium: "w-4 h-4",
      large: "w-5 h-5",
      xl: "w-6 h-6",
    };

    const isDisabled = disabled || loading;
    const disabledStyles = isDisabled
      ? "opacity-75 cursor-not-allowed"
      : "hover:scale-[1.02] hover:shadow-lg";

    const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${disabledStyles}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {loading && (
          <div
            className={`animate-spin rounded-full border-b-2 border-white mr-2 ${
              size === "small"
                ? "h-3 w-3"
                : size === "medium"
                ? "h-4 w-4"
                : size === "large"
                ? "h-5 w-5"
                : "h-6 w-6"
            }`}
          />
        )}

        {!loading && Icon && iconPosition === "left" && (
          <Icon className={`${iconSizes[size]} mr-2`} />
        )}

        {children}

        {!loading && Icon && iconPosition === "right" && (
          <Icon className={`${iconSizes[size]} ml-2`} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
