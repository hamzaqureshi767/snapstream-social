import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Post, formatTimestamp, formatNumber } from "@/data/mockData";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);
  const [showHeart, setShowHeart] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes(likes + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 600);
  };

  const handlePostComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      user: {
        id: "1",
        username: "you",
        fullName: "You",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        bio: "",
        followers: 0,
        following: 0,
        postsCount: 0,
        isFollowing: false,
      },
      text: comment,
      timestamp: new Date(),
      likes: 0,
    };
    setComments([...comments, newComment]);
    setComment("");
  };

  return (
    <article className="bg-background border-b border-border md:border md:rounded-lg md:mb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${post.user.username}`} className="flex items-center gap-3">
          <div className="story-ring">
            <div className="story-ring-inner">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-8 h-8 rounded-full object-cover"
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
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

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
            <button type="button" onClick={handleLike} className="transition-transform hover:scale-110 active:scale-95">
              <Heart
                className={cn(
                  "w-6 h-6 transition-colors",
                  isLiked ? "text-red-500 fill-red-500" : "text-foreground"
                )}
              />
            </button>
            <Link to={`/post/${post.id}`} className="transition-transform hover:scale-110">
              <MessageCircle className="w-6 h-6" />
            </Link>
            <button type="button" className="transition-transform hover:scale-110">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
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
          {formatNumber(likes)} likes
        </p>

        {/* Caption */}
        <p className="text-sm">
          <Link to={`/profile/${post.user.username}`} className="font-semibold mr-1">
            {post.user.username}
          </Link>
          {post.caption}
        </p>

        {/* Comments Link */}
        {comments.length > 0 && (
          <Link
            to={`/post/${post.id}`}
            className="text-sm text-muted-foreground mt-1 block"
          >
            View all {comments.length} comments
          </Link>
        )}

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1 uppercase">
          {formatTimestamp(post.timestamp)}
        </p>

        {/* Comment Input */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          {comment.trim() && (
            <button
              type="button"
              onClick={handlePostComment}
              className="text-primary font-semibold text-sm"
            >
              Post
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;