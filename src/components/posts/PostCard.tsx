import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Post, formatTimestamp, formatNumber } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { useSavedPosts } from "@/hooks/useSavedPosts";
import CommentSection from "./CommentSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
}

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    isLiked,
    likesCount,
    comments,
    toggleLike,
    addComment,
    deleteComment,
    isAuthenticated,
    currentUserId,
  } = usePostInteractions(post.id, post.likes);

  // Check if post ID is a valid UUID for save functionality
  const isRealPost = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post.id);
  const { isSaved: dbSaved, toggleSave } = useSavedPosts(isRealPost ? post.id : undefined);
  
  // Local state for mock posts
  const [localSaved, setLocalSaved] = useState(post.isSaved);
  const isSaved = isRealPost ? dbSaved : localSaved;

  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnPost = currentUserId === post.user.id;

  const handleSave = () => {
    if (isRealPost) {
      toggleSave();
    } else {
      setLocalSaved((prev) => !prev);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked && isAuthenticated) {
      toggleLike();
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 600);
  };

  const handleDeletePost = async () => {
    if (!currentUserId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id)
        .eq("user_id", currentUserId);

      if (error) throw error;

      toast({ title: "Post deleted successfully" });
      onDelete?.(post.id);
    } catch (error: any) {
      toast({
        title: "Failed to delete post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <article className="bg-background border-b border-border md:border md:rounded-lg md:mb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${post.user.username}`} className="flex items-center gap-3">
          <div className="story-ring">
            <div className="story-ring-inner">
              <img
                src={post.user.avatar || '/default-avatar.jpg'}
                alt={post.user.username}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">{post.user.username}</span>
              {post.user.isVerified && (
                <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              )}
            </div>
            {post.location && (
              <span className="text-xs text-muted-foreground">{post.location}</span>
            )}
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isOwnPost ? (
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete post
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => navigate(`/post/${post.id}`)}>
                View post
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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

      {/* Image */}
      <div
        className="relative aspect-square bg-muted cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Heart
              className="w-24 h-24 text-white animate-heart drop-shadow-lg"
              fill="white"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => isAuthenticated && toggleLike()}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <Heart
                className={cn(
                  "w-6 h-6 transition-colors",
                  isLiked ? "text-red-500 fill-red-500" : "text-foreground"
                )}
              />
            </button>
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="transition-transform hover:scale-110"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button type="button" className="transition-transform hover:scale-110">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Bookmark
              className={cn(
                "w-6 h-6",
                isSaved && "fill-foreground"
              )}
            />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-1">
          {formatNumber(likesCount)} likes
        </p>

        {/* Caption */}
        <p className="text-sm">
          <Link to={`/profile/${post.user.username}`} className="font-semibold mr-1">
            {post.user.username}
          </Link>
          {post.caption}
        </p>

        {/* Comments toggle */}
        {comments.length > 0 && !showComments && (
          <button
            type="button"
            onClick={() => setShowComments(true)}
            className="text-sm text-muted-foreground mt-1 block hover:text-foreground transition-colors"
          >
            View all {comments.length} comments
          </button>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1 uppercase">
          {formatTimestamp(post.timestamp)}
        </p>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-3">
            <CommentSection
              comments={comments}
              onAddComment={addComment}
              onDeleteComment={deleteComment}
              isAuthenticated={isAuthenticated}
              currentUserId={currentUserId}
            />
          </div>
        )}

        {/* Quick comment input when comments are hidden */}
        {!showComments && isAuthenticated && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm focus:outline-none"
              onFocus={() => setShowComments(true)}
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
