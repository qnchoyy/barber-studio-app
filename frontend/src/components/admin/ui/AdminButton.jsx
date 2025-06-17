import { forwardRef } from "react";

const AdminButton = forwardRef(
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
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white focus:ring-purple-500 disabled:from-purple-400 disabled:to-pink-400",

      secondary:
        "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white focus:ring-blue-500 disabled:from-blue-400 disabled:to-cyan-400",

      success:
        "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white focus:ring-green-500 disabled:from-green-400 disabled:to-emerald-400",

      danger:
        "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white focus:ring-red-500 disabled:from-red-400 disabled:to-pink-400",

      warning:
        "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white focus:ring-yellow-500 disabled:from-yellow-400 disabled:to-orange-400",

      outline:
        "border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/40 focus:ring-gray-500 disabled:border-white/10 disabled:text-gray-500",

      ghost:
        "text-gray-300 hover:bg-white/10 hover:text-white focus:ring-gray-500 disabled:text-gray-500 hover:backdrop-blur-sm",

      glass:
        "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-white/40 focus:ring-white/50 disabled:bg-white/5 disabled:border-white/10",
    };

    const sizeStyles = {
      small: "px-3 py-2 text-sm h-8",
      medium: "px-4 py-3 text-sm h-10",
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
      : "hover:scale-105 hover:shadow-lg active:scale-95";

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
          <Icon className={`${iconSizes[size]} ${children ? "mr-2" : ""}`} />
        )}

        {children}

        {!loading && Icon && iconPosition === "right" && (
          <Icon className={`${iconSizes[size]} ${children ? "ml-2" : ""}`} />
        )}
      </button>
    );
  }
);

AdminButton.displayName = "AdminButton";

export default AdminButton;
