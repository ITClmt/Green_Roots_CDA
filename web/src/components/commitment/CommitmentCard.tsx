import type { ReactNode } from "react";

interface CommitmentCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: "light" | "dark";
}

export function CommitmentCard({
  icon,
  title,
  description,
  variant = "light",
}: CommitmentCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={`relative overflow-hidden p-8 rounded-2xl shadow-sm transition-shadow ${
        isDark ? "bg-[#2d6a4f] text-white" : "bg-[#f0f3eb]"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 relative z-10 ${
          isDark ? "bg-[#1b4f3b] text-white" : "bg-[#d3e7b1] text-[#134d37]"
        }`}
      >
        {icon}
      </div>

      <h3
        className={`text-xl font-bold mb-4 relative z-10 ${isDark ? "text-white" : "text-[#1a2f24]"}`}
      >
        {title}
      </h3>

      <p
        className={`leading-relaxed relative z-10 ${isDark ? "text-gray-200" : "text-gray-600"}`}
      >
        {description}
      </p>
    </div>
  );
}
