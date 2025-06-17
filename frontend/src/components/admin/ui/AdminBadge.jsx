import { forwardRef } from "react";

const AdminBadge = forwardRef(
  (
    {
      variant = "default",
      size = "medium",
      className = "",
      children,
      dot = false,
      pulse = false,
      ...props
    },
    ref
  ) => {
    const baseStyles = dot
      ? "inline-block rounded-full"
      : "inline-flex items-center justify-center font-medium rounded-full";

    const variantStyles = {
      default: "bg-gray-500/20 text-gray-300 border border-gray-500/30",

      primary:
        "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30",

      success:
        "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30",

      danger:
        "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30",

      warning:
        "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30",

      info: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30",

      notification: "bg-red-500 text-white border-0",

      online: "bg-green-400 text-white border-0",
      offline: "bg-gray-500 text-white border-0",
      busy: "bg-red-400 text-white border-0",
      away: "bg-yellow-400 text-white border-0",
    };

    const sizeStyles = dot
      ? {
          small: "w-2 h-2",
          medium: "w-3 h-3",
          large: "w-4 h-4",
          xl: "w-5 h-5",
        }
      : {
          small: "px-2 py-1 text-xs min-w-[1.25rem] h-5",
          medium: "px-2.5 py-1 text-xs min-w-[1.5rem] h-6",
          large: "px-3 py-1.5 text-sm min-w-[1.75rem] h-7",
          xl: "px-4 py-2 text-sm min-w-[2rem] h-8",
        };

    const pulseClass = pulse ? "animate-pulse" : "";

    const badgeClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${pulseClass}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {children}
      </span>
    );
  }
);

AdminBadge.displayName = "AdminBadge";

export default AdminBadge;
