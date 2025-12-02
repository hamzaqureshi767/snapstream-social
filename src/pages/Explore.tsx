import MainLayout from "@/components/layout/MainLayout";
import { posts } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { formatNumber } from "@/data/mockData";

const Explore = () => {
  return (
    <MainLayout showHeader={false}>
      <div className="max-w-4xl mx-auto pt-4 md:pt-8">
        <h1 className="hidden md:block text-xl font-semibold mb-6 px-4">Explore</h1>
        
        <div className="grid grid-cols-3 gap-0.5 md:gap-1">
          {[...posts, ...posts, ...posts].map((post, index) => (
            <Link
              key={`${post.id}-${index}`}
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
      </div>
    </MainLayout>
  );
};

export default Explore;
