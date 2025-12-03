import { Bookmark } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useFetchSavedPosts } from "@/hooks/useSavedPosts";
import { Link } from "react-router-dom";

const SavedPosts = () => {
  const { savedPosts, loading } = useFetchSavedPosts();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Bookmark className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Saved</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-sm" />
            ))}
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bookmark className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved posts yet</h2>
            <p className="text-muted-foreground">
              Save photos and videos that you want to see again.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {savedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="aspect-square relative group overflow-hidden rounded-sm"
              >
                <img
                  src={post.image_url}
                  alt={post.caption || "Saved post"}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-4 text-white font-semibold">
                    <span className="flex items-center gap-1">
                      ❤️ {post.likes_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SavedPosts;
