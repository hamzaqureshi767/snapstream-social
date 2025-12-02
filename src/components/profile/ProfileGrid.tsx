import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Post, formatNumber } from "@/data/mockData";

interface ProfileGridProps {
  posts: Post[];
}

const ProfileGrid = ({ posts }: ProfileGridProps) => {
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
    <div className="grid grid-cols-3 gap-0.5 md:gap-1">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.id}`}
          className="relative aspect-square group"
        >
          <img
            src={post.image}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Heart className="w-5 h-5" fill="white" />
              {formatNumber(post.likes)}
            </div>
            <div className="flex items-center gap-2 text-white font-semibold">
              <MessageCircle className="w-5 h-5" fill="white" />
              {post.comments.length}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProfileGrid;
