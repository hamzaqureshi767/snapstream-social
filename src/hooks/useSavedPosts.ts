import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useSavedPosts = (postId?: string) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if a specific post is saved
  useEffect(() => {
    if (!user || !postId) return;

    const checkSaved = async () => {
      const { data } = await supabase
        .from("saved_posts")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .maybeSingle();

      setIsSaved(!!data);
    };

    checkSaved();
  }, [postId, user]);

  const toggleSave = async () => {
    if (!user || !postId) return;

    setLoading(true);
    try {
      if (isSaved) {
        await supabase
          .from("saved_posts")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
        setIsSaved(false);
      } else {
        await supabase.from("saved_posts").insert({
          post_id: postId,
          user_id: user.id,
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setLoading(false);
    }
  };

  return { isSaved, toggleSave, loading, setIsSaved };
};

// Hook to fetch all saved posts
export const useFetchSavedPosts = () => {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSavedPosts = async () => {
      setLoading(true);
      const { data: savedData, error: savedError } = await supabase
        .from("saved_posts")
        .select("post_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (savedError || !savedData?.length) {
        setSavedPosts([]);
        setLoading(false);
        return;
      }

      const postIds = savedData.map((s) => s.post_id);

      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select(`
          id,
          image_url,
          caption,
          location,
          likes_count,
          created_at,
          user_id,
          profile:profiles!posts_user_id_fkey (
            id,
            username,
            avatar,
            full_name
          )
        `)
        .in("id", postIds);

      if (!postsError && posts) {
        // Sort by saved order
        const sortedPosts = postIds
          .map((id) => posts.find((p) => p.id === id))
          .filter(Boolean);
        setSavedPosts(sortedPosts);
      }
      setLoading(false);
    };

    fetchSavedPosts();
  }, [user]);

  const removeSavedPost = (postId: string) => {
    setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return { savedPosts, loading, removeSavedPost };
};
