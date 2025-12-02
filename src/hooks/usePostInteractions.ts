import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  profile: {
    username: string;
    avatar: string | null;
  };
  replies?: Comment[];
}

export const usePostInteractions = (postId: string, initialLikes: number) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Check if user has liked the post
  useEffect(() => {
    if (!user) return;

    const checkLiked = async () => {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      setIsLiked(!!data);
    };

    checkLiked();
  }, [postId, user]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          parent_id,
          profile:profiles!comments_user_id_fkey (
            username,
            avatar
          )
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        // Organize comments into threads
        const topLevel = data.filter((c) => !c.parent_id) as Comment[];
        const replies = data.filter((c) => c.parent_id) as Comment[];

        topLevel.forEach((comment) => {
          comment.replies = replies.filter((r) => r.parent_id === comment.id);
        });

        setComments(topLevel);
      }
      setLoadingComments(false);
    };

    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar")
            .eq("id", payload.new.user_id)
            .single();

          if (profile) {
            const newComment = { ...payload.new, profile } as Comment;
            
            setComments((prev) => {
              if (newComment.parent_id) {
                // It's a reply
                return prev.map((c) =>
                  c.id === newComment.parent_id
                    ? { ...c, replies: [...(c.replies || []), newComment] }
                    : c
                );
              }
              // Top-level comment
              return [...prev, { ...newComment, replies: [] }];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const toggleLike = async () => {
    if (!user) return;

    if (isLiked) {
      // Unlike
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      // Like
      await supabase.from("likes").insert({
        post_id: postId,
        user_id: user.id,
      });

      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const addComment = async (content: string, parentId?: string) => {
    if (!user || !content.trim()) return;

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      content: content.trim(),
      parent_id: parentId || null,
    });
  };

  return {
    isLiked,
    likesCount,
    comments,
    loadingComments,
    toggleLike,
    addComment,
    isAuthenticated: !!user,
  };
};
