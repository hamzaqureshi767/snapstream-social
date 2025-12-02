import { useState } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Post, formatNumber } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfileGridProps {
  posts: Post[];
  isOwnProfile?: boolean;
  onPostDelete?: (postId: string) => void;
}

const ProfileGrid = ({ posts, isOwnProfile = false, onPostDelete }: ProfileGridProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async () => {
    if (!deletePostId || !user) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", deletePostId)
        .eq("user_id", user.id);

      if (error) throw error;

      onPostDelete?.(deletePostId);
      toast({ title: "Post deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletePostId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full border-2 border-foreground flex items-center justify-center mb-4">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <h3 className="text-2xl font-light mb-2">No Posts Yet</h3>
        <p className="text-muted-foreground">When you share photos, they will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 md:gap-1">
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative aspect-square group"
          >
            <Link to={`/post/${post.id}`}>
              <img
                src={post.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </Link>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 pointer-events-none">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Heart className="w-5 h-5" fill="white" />
                {formatNumber(post.likes)}
              </div>
              <div className="flex items-center gap-2 text-white font-semibold">
                <MessageCircle className="w-5 h-5" fill="white" />
                {post.comments.length}
              </div>
            </div>
            {isOwnProfile && (
              <button
                type="button"
                onClick={() => setDeletePostId(post.id)}
                className="absolute top-2 right-2 p-2 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileGrid;
