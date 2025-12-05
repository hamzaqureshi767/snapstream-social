import { cn } from "@/lib/utils";

interface OnlineIndicatorProps {
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const OnlineIndicator = ({ isOnline, size = "md", className }: OnlineIndicatorProps) => {
  const sizeClasses = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  if (!isOnline) return null;

  return (
    <div
      className={cn(
        "absolute bottom-0 right-0 rounded-full bg-green-500 border-2 border-background",
        sizeClasses[size],
        className
      )}
    />
  );
};
