import { cn } from "@/lib/utils";
import { Story } from "@/data/mockData";
import { Plus } from "lucide-react";

interface StoryCircleProps {
  story?: Story;
  isOwn?: boolean;
  onClick?: () => void;
}

const StoryCircle = ({ story, isOwn = false, onClick }: StoryCircleProps) => {
  const user = story?.user;
  const isViewed = story?.isViewed;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 min-w-[76px] group"
    >
      <div className={cn(
        "relative",
        !isViewed && !isOwn && "story-ring"
      )}>
        <div className={cn(
          !isViewed && !isOwn && "story-ring-inner"
        )}>
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"}
            alt={user?.username || "Your story"}
            className={cn(
              "w-14 h-14 md:w-16 md:h-16 rounded-full object-cover transition-transform group-hover:scale-105",
              isViewed && "opacity-60"
            )}
          />
        </div>
        {isOwn && (
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center border-2 border-background">
            <Plus className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
          </div>
        )}
      </div>
      <span className={cn(
        "text-xs truncate max-w-[70px]",
        isViewed ? "text-muted-foreground" : "text-foreground"
      )}>
        {isOwn ? "Your story" : user?.username}
      </span>
    </button>
  );
};

export default StoryCircle;
