import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onDeleteComment: (commentId: string) => void;
  isAuthenticated: boolean;
  currentUserId?: string;
}

const CommentItem = ({
  comment,
  onReply,
  onDelete,
  isAuthenticated,
  currentUserId,
}: {
  comment: Comment;
  onReply: (parentId: string, username: string) => void;
  onDelete: (commentId: string) => void;
  isAuthenticated: boolean;
  currentUserId?: string;
}) => {
  const canDelete = currentUserId === comment.user_id;
  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <Link to={`/profile/${comment.profile.username}`}>
          <img
            src={comment.profile.avatar || "/default-avatar.jpg"}
            alt={comment.profile.username}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <Link
              to={`/profile/${comment.profile.username}`}
              className="font-semibold mr-2 hover:underline"
            >
              {comment.profile.username}
            </Link>
            {comment.content}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => onReply(comment.id, comment.profile.username)}
                className="font-semibold hover:text-foreground transition-colors"
              >
                Reply
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                className="text-destructive hover:text-destructive/80 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-2 border-l-2 border-border pl-3">
          {comment.replies.map((reply) => {
            const canDeleteReply = currentUserId === reply.user_id;
            return (
              <div key={reply.id} className="flex gap-3">
                <Link to={`/profile/${reply.profile.username}`}>
                  <img
                    src={reply.profile.avatar || "/default-avatar.jpg"}
                    alt={reply.profile.username}
                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = '/default-avatar.jpg'; }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <Link
                      to={`/profile/${reply.profile.username}`}
                      className="font-semibold mr-2 hover:underline"
                    >
                      {reply.profile.username}
                    </Link>
                    {reply.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                    </span>
                    {canDeleteReply && (
                      <button
                        type="button"
                        onClick={() => onDelete(reply.id)}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CommentSection = ({
  comments,
  onAddComment,
  onDeleteComment,
  isAuthenticated,
  currentUserId,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    onAddComment(newComment, replyingTo?.id);
    setNewComment("");
    setReplyingTo(null);
  };

  const handleReply = (parentId: string, username: string) => {
    setReplyingTo({ id: parentId, username });
    setNewComment(`@${username} `);
  };

  return (
    <div className="space-y-3">
      {comments.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={onDeleteComment}
              isAuthenticated={isAuthenticated}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {isAuthenticated && (
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <div className="flex-1 relative">
            {replyingTo && (
              <div className="absolute -top-6 left-0 text-xs text-muted-foreground flex items-center gap-2">
                <span>Replying to @{replyingTo.username}</span>
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setNewComment("");
                  }}
                  className="text-primary hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Add a comment..."
              className="border-0 bg-transparent focus-visible:ring-0 px-0 text-sm"
            />
          </div>
          {newComment.trim() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSubmit}
              className="text-primary font-semibold hover:text-primary/80"
            >
              Post
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
