"use client";

interface FancyButtonProps {
  children: React.ReactNode;
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
  hoverColor?: string;
  className?: string;
}

export default function FancyButton({
  children,
  borderColor = "#22a6dd",
  bgColor = "#ffffff",
  textColor = "#000000",
  hoverColor = "#22a6dd",
  className = "",
}: FancyButtonProps) {
  return (
    <button
      className={`group cursor-pointer relative overflow-hidden px-8 py-2 rounded-full shadow-md font-medium transition-all duration-1000 ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        background: bgColor,
        color: textColor,
      }}
    >
      {/* background animation */}
      <span
        className="absolute inset-0 -z-10 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"
        style={{ background: hoverColor }}
      />

      {/* text color change */}
      <span className="relative z-20 group-hover:text-white transition-colors duration-1000">
        {children}
      </span>
    </button>
  );
}
