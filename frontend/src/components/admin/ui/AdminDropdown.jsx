import { useState, useRef, useEffect } from "react";

const AdminDropdown = ({
  trigger,
  children,
  placement = "bottom-right",
  offset = 8,
  className = "",
  triggerClassName = "",
  contentClassName = "",
  disabled = false,
  closeOnClick = true,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(e.target) &&
        !contentRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const placementStyles = {
    "top-left": "bottom-full right-0 mb-2",
    "top-right": "bottom-full left-0 mb-2",
    "bottom-left": "top-full right-0 mt-2",
    "bottom-right": "top-full right-0 mt-2",
    left: "right-full top-0 mr-2",
    right: "left-full top-0 ml-2",
  };

  const toggleOpen = () => {
    if (!disabled) setIsOpen((o) => !o);
  };

  const handleContentClick = (e) => {
    if (closeOnClick && !e.target.closest("[data-no-close]")) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <div
        ref={triggerRef}
        onClick={toggleOpen}
        className={`cursor-pointer ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${triggerClassName}`}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={contentRef}
          onClick={handleContentClick}
          className={`
            absolute ${placementStyles[placement]}
            bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl
            border border-white/10 z-[9999]
            animate-in fade-in slide-in-from-top-2 duration-200
            ${contentClassName}
          `}
          style={{
            marginTop: placement.includes("bottom") ? `${offset}px` : undefined,
          }}
        >
          {children}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const AdminDropdownItem = ({
  children,
  onClick,
  disabled = false,
  danger = false,
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        flex items-center space-x-3 px-4 py-3 text-sm
        transition-colors cursor-pointer
        ${
          disabled
            ? "text-gray-500 cursor-not-allowed"
            : danger
            ? "text-red-300 hover:text-red-200 hover:bg-red-500/10"
            : "text-gray-300 hover:text-white hover:bg-white/10"
        }
        rounded-xl mx-2 my-1
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span className="flex-1">{children}</span>
    </div>
  );
};

const AdminDropdownSeparator = ({ className = "" }) => (
  <div className={`my-2 border-t border-white/10 ${className}`} />
);
const AdminDropdownHeader = ({ children, className = "" }) => (
  <div className={`px-4 py-3 border-b border-white/10 ${className}`}>
    <h3 className="text-lg font-semibold text-white">{children}</h3>
  </div>
);
const AdminDropdownFooter = ({ children, className = "" }) => (
  <div className={`px-4 py-3 border-t border-white/10 ${className}`}>
    {children}
  </div>
);

AdminDropdown.Item = AdminDropdownItem;
AdminDropdown.Separator = AdminDropdownSeparator;
AdminDropdown.Header = AdminDropdownHeader;
AdminDropdown.Footer = AdminDropdownFooter;

export default AdminDropdown;
