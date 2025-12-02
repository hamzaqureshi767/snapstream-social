import { posts } from "@/data/mockData";
import PostCard from "./PostCard";

const Feed = () => {
  return (
    <div className="max-w-[470px] mx-auto">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
