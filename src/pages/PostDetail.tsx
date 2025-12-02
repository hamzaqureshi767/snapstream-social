import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { posts, formatTimestamp, formatNumber } from "@/data/mockData";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.id === id);
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [isSaved, setIsSaved] = useState(post?.isSaved || false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [comment, setComment] = useState("");

  if (!post) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Post not found</p>
        </div>
      </MainLayout>
    );
  }

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <MainLayout showHeader={false}>
      <div className="min-h-screen md:flex md:items-center md:justify-center md:py-8 md:px-4">
        <div className="bg-background md:border md:border-border md:rounded-lg md:overflow-hidden md:max-w-5xl md:w-full md:flex">
          {/* Close button - Mobile */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 z-10 md:hidden"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="aspect-square md:w-3/5 bg-muted">
            <img
              src={post.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="md:w-2/5 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link to={`/profile/${post.user.username}`} className="flex items-center gap-3">
                <img
                  src={post.user.avatar}
                  alt={post.user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-semibold text-sm">{post.user.username}</span>
                {post.user.isVerified && (
                  <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                )}
              </Link>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Caption */}
              <div className="flex gap-3">
                <Link to={`/profile/${post.user.username}`}>
                  <img
                    src={post.user.avatar}
                    alt={post.user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Link>
                <div>
                  <p className="text-sm">
                    <Link to={`/profile/${post.user.username}`} className="font-semibold mr-1">
                      {post.user.username}
                    </Link>
                    {post.caption}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(post.timestamp)}
                  </p>
                </div>
              </div>

              {/* Comments List */}
              {post.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Link to={`/profile/${c.user.username}`}>
                    <img
                      src={c.user.avatar}
                      alt={c.user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="text-sm">
                      <Link to={`/profile/${c.user.username}`} className="font-semibold mr-1">
                        {c.user.username}
                      </Link>
                      {c.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{formatTimestamp(c.timestamp)}</span>
                      <button className="font-semibold">{c.likes} likes</button>
                      <button className="font-semibold">Reply</button>
                    </div>
                  </div>
                  <button className="self-center">
                    <Heart className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <button onClick={handleLike}>
                    <Heart
                      className={cn(
                        "w-6 h-6",
                        isLiked && "text-red-500 fill-red-500"
                      )}
                    />
                  </button>
                  <button>
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button>
                    <Send className="w-6 h-6" />
                  </button>
                </div>
                <button onClick={() => setIsSaved(!isSaved)}>
                  <Bookmark className={cn("w-6 h-6", isSaved && "fill-foreground")} />
                </button>
              </div>
              <p className="font-semibold text-sm mb-1">{formatNumber(likes)} likes</p>
              <p className="text-xs text-muted-foreground uppercase">
                {formatTimestamp(post.timestamp)}
              </p>
            </div>

            {/* Comment Input */}
            <div className="border-t border-border p-4 flex items-center gap-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
              {comment && (
                <button className="text-primary font-semibold text-sm">
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostDetail;
