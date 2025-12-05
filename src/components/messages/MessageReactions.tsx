import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Reaction {
  id: string;
  emoji: string;
  user_id: string;
}

interface MessageReactionsProps {
  messageId: string;
  isOwnMessage: boolean;
}

const EMOJI_OPTIONS = ["❤️", "😂", "😮", "😢", "😡", "👍"];

export const MessageReactions = ({ messageId, isOwnMessage }: MessageReactionsProps) => {
  const { user, loading } = useAuth();
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    // Don't fetch if auth is still loading or no user
    if (loading || !user) return;

    const fetchReactions = async () => {
      const { data } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId);
      if (data) setReactions(data);
    };

    fetchReactions();
  }, [messageId, user, loading]);

  const toggleReaction = async (emoji: string) => {
    if (!user) return;

    const existing = reactions.find(r => r.user_id === user.id && r.emoji === emoji);
    
    if (existing) {
      await supabase
        .from('message_reactions')
        .delete()
        .eq('id', existing.id);
      setReactions(prev => prev.filter(r => r.id !== existing.id));
    } else {
      const { data } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        })
        .select()
        .single();
      if (data) {
        setReactions(prev => [...prev, data]);
      }
    }
    setShowPicker(false);
  };

  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = [];
    acc[r.emoji].push(r.user_id);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className={cn("flex items-center gap-1 group/reaction", isOwnMessage ? "flex-row-reverse" : "flex-row")}>
      {/* Display existing reactions */}
      {Object.entries(groupedReactions).map(([emoji, userIds]) => (
        <button
          key={emoji}
          onClick={() => toggleReaction(emoji)}
          className={cn(
            "text-xs px-1.5 py-0.5 rounded-full bg-secondary/80 hover:bg-secondary transition-colors",
            userIds.includes(user?.id || '') && "ring-1 ring-primary"
          )}
        >
          {emoji} {userIds.length > 1 && userIds.length}
        </button>
      ))}

      {/* Add reaction button */}
      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <button className="opacity-50 hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded">
            <Smile className="w-4 h-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" side={isOwnMessage ? "left" : "right"}>
          <div className="flex gap-1">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => toggleReaction(emoji)}
                className="text-lg hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
