import { useState, useRef } from "react";
import { stories } from "@/data/mockData";
import StoryCircle from "./StoryCircle";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2 } from "lucide-react";

const StoriesBar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/story-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      const { error: storyError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          image_url: publicUrl,
        });

      if (storyError) throw storyError;

      toast({ title: "Story added!" });
    } catch (error: any) {
      toast({ title: "Failed to add story", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-background border-b border-border md:border md:rounded-lg md:mb-4">
      <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide">
        {/* Add Story Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex flex-col items-center gap-1 min-w-[76px] group"
        >
          <div className="relative">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/50 group-hover:border-primary transition-colors">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              ) : (
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Your story</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAddStory}
          className="hidden"
        />
        
        {/* Other Stories */}
        {stories.map((story) => (
          <StoryCircle key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default StoriesBar;
