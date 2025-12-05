import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PresenceState {
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>; // conversationId -> comma-separated user ids
}

export const usePresence = (conversationId?: string) => {
  const { user, loading } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Track online status - only when user is loaded and authenticated
  useEffect(() => {
    if (loading || !user?.id) return;

    const channel = supabase.channel('online-users', {
      config: { presence: { key: user.id } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const online = new Set<string>();
        Object.keys(state).forEach(userId => {
          online.add(userId);
        });
        setOnlineUsers(online);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers(prev => new Set([...prev, key]));
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers(prev => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, loading]);

  // Track typing status for a conversation
  useEffect(() => {
    if (loading || !user?.id || !conversationId) return;

    const channel = supabase.channel(`typing-${conversationId}`, {
      config: { presence: { key: user.id } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const typing = new Set<string>();
        Object.entries(state).forEach(([userId, presences]) => {
          const presence = presences[0] as any;
          if (presence?.typing && userId !== user.id) {
            typing.add(userId);
          }
        });
        setTypingUsers(typing);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, conversationId, loading]);

  const setTyping = useCallback(async (isTyping: boolean) => {
    if (!user?.id || !conversationId) return;

    const channel = supabase.channel(`typing-${conversationId}`);
    await channel.track({ typing: isTyping });
  }, [user?.id, conversationId]);

  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  const isUserTyping = useCallback((userId: string) => {
    return typingUsers.has(userId);
  }, [typingUsers]);

  return {
    onlineUsers,
    typingUsers,
    setTyping,
    isUserOnline,
    isUserTyping,
  };
};
